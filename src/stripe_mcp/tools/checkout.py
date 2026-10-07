from typing import Annotated, Any, Dict, List, Optional

from fastmcp import Context
from pydantic import Field

from stripe_mcp.austria_tax import calculate_austrian_tax
from stripe_mcp.config import settings
from stripe_mcp.models import AustrianVatType, CheckoutOp
from stripe_mcp.safety import audit_log, check_and_record_velocity, confirm_write


async def handle_manage_checkout(
    operation: Annotated[CheckoutOp, Field(description="Checkout operation enum (create_payment_link, create_checkout_session, create_invoice)")],
    amount: Annotated[float, Field(description="Net amount in major currency units (e.g. 99.00 EUR)")],
    currency: Annotated[str, Field(description="Currency code (default EUR)")] = "EUR",
    payment_method_types: Annotated[Optional[List[str]], Field(description="Allowed payment methods, e.g., ['card', 'eps', 'sepa_debit', 'klarna']")] = None,
    customer_id: Annotated[Optional[str], Field(description="Associated Stripe Customer ID (cus_...)")] = None,
    customer_vat_id: Annotated[Optional[str], Field(description="Customer EU VAT ID (e.g. ATU12345678) for Reverse Charge")] = None,
    vat_type: Annotated[AustrianVatType, Field(description="Austrian VAT type (standard_20, reduced_10, reduced_13)")] = AustrianVatType.STANDARD_20,
    ctx: Optional[Context] = None,
) -> Dict[str, Any]:
    """Create Stripe Checkout Sessions, Payment Links, or BAO-compliant Invoices with Austrian/EU tax calculation.

    ## Return Format
    Returns a dictionary containing `success: True`, `checkout_url` / `invoice_data`, tax breakdown, and payment method details.

    ## Examples
    - `manage_stripe_checkout(operation="create_payment_link", amount=120.00, payment_method_types=["card", "eps"])`
    - `manage_stripe_checkout(operation="create_invoice", amount=500.00, customer_vat_id="ATU12345678")`
    """
    audit_base = {"tool": "manage_stripe_checkout", "operation": operation.value, "amount_eur": amount, "customer_id": customer_id}

    if settings.stripe_read_only:
        audit_log({**audit_base, "result": "blocked_read_only"})
        return {"success": False, "error": "STRIPE_READ_ONLY mode enabled. Checkout/invoice creation blocked."}

    if amount > settings.max_checkout_amount_eur:
        audit_log({**audit_base, "result": "blocked_amount_cap"})
        return {
            "success": False,
            "error": f"SafetyCapExceeded: Amount (EUR {amount:.2f}) exceeds configured agent safety limit of EUR {settings.max_checkout_amount_eur:.2f}."
        }

    tax_calc = calculate_austrian_tax(amount, vat_type=vat_type, customer_vat_id=customer_vat_id)
    methods = payment_method_types or ["card", "eps", "sepa_debit"]

    if settings.is_mock_mode:
        if operation == CheckoutOp.CREATE_PAYMENT_LINK:
            return {
                "success": True,
                "mode": "MOCK",
                "operation": "create_payment_link",
                "payment_link_id": "plink_mock_austria_888",
                "url": "https://buy.stripe.com/mock_austria_pay_link",
                "amount_net_eur": tax_calc["net_amount"],
                "vat_amount_eur": tax_calc["vat_amount"],
                "amount_gross_eur": tax_calc["gross_amount"],
                "payment_methods": methods,
                "legal_note": tax_calc["legal_note"]
            }

        if operation == CheckoutOp.CREATE_CHECKOUT_SESSION:
            return {
                "success": True,
                "mode": "MOCK",
                "operation": "create_checkout_session",
                "session_id": "cs_test_mock_session_999",
                "url": "https://checkout.stripe.com/c/pay/cs_test_mock_session_999",
                "status": "open",
                "psd2_3ds2_supported": True,
                "amount_total_eur": tax_calc["gross_amount"],
                "payment_methods": methods
            }

        if operation == CheckoutOp.CREATE_INVOICE:
            return {
                "success": True,
                "mode": "MOCK",
                "operation": "create_invoice",
                "invoice_id": "in_mock_bao_2026_001",
                "seller_uid": "ATU78901234",
                "customer_id": customer_id or "cus_at_101",
                "tax_breakdown": tax_calc,
                "bao_compliance": {
                    "retention_years": 7,
                    "legal_basis": "§ 132 BAO (Bundesabgabenordnung)"
                },
                "status": "draft"
            }

        return {"success": True, "mode": "MOCK", "operation": operation.value}

    import hashlib

    import stripe
    stripe.api_key = settings.stripe_api_key

    if operation == CheckoutOp.CREATE_INVOICE and not customer_id:
        audit_log({**audit_base, "result": "blocked_missing_customer_id"})
        return {
            "success": False,
            "error": (
                "customer_id is required to create a real Stripe invoice -- Stripe "
                "invoices must be attached to an existing customer. Call "
                "manage_stripe_customers(operation=\"create\") first, or omit "
                "STRIPE_API_KEY / use a mock key to exercise this in mock mode."
            ),
        }

    velocity_error = check_and_record_velocity("checkout", amount, settings.max_checkout_total_eur_per_day)
    if velocity_error:
        audit_log({**audit_base, "result": "blocked_velocity_cap"})
        return {"success": False, "error": velocity_error}

    confirmed, confirm_error = await confirm_write(
        ctx, f"Create a live {operation.value} for EUR {amount:.2f} ({currency})?"
    )
    if not confirmed:
        audit_log({**audit_base, "result": "blocked_not_confirmed", "detail": confirm_error})
        return {"success": False, "error": f"NotConfirmed: {confirm_error}"}

    base_key = hashlib.sha256(
        f"checkout|{operation.value}|{amount}|{currency}|{customer_id}|{vat_type}".encode()
    ).hexdigest()

    try:
        if operation == CheckoutOp.CREATE_CHECKOUT_SESSION:
            line_items = [{
                "price_data": {
                    "currency": currency.lower(),
                    "product_data": {"name": "Service / Purchase (AT/EU)"},
                    "unit_amount": int(tax_calc["gross_amount"] * 100)
                },
                "quantity": 1
            }]
            session = stripe.checkout.Session.create(
                payment_method_types=methods,
                line_items=line_items,
                mode="payment",
                success_url="https://example.com/success",
                cancel_url="https://example.com/cancel",
                idempotency_key=base_key
            )
            audit_log({**audit_base, "result": "executed", "session_id": session.id})
            return {"success": True, "mode": settings.stripe_mode, "url": session.url, "session_id": session.id}

        if operation == CheckoutOp.CREATE_PAYMENT_LINK:
            link = stripe.PaymentLink.create(
                line_items=[{
                    "price_data": {
                        "currency": currency.lower(),
                        "unit_amount": int(tax_calc["gross_amount"] * 100),
                        "product_data": {"name": "Service / Purchase (AT/EU)"},
                    },
                    "quantity": 1,
                }],
                payment_method_types=methods,
                idempotency_key=base_key
            )
            audit_log({**audit_base, "result": "executed", "payment_link_id": link.id})
            return {
                "success": True,
                "mode": settings.stripe_mode,
                "operation": "create_payment_link",
                "payment_link_id": link.id,
                "url": link.url,
                "amount_net_eur": tax_calc["net_amount"],
                "vat_amount_eur": tax_calc["vat_amount"],
                "amount_gross_eur": tax_calc["gross_amount"],
                "payment_methods": methods,
                "legal_note": tax_calc["legal_note"],
            }

        if operation == CheckoutOp.CREATE_INVOICE:
            stripe.InvoiceItem.create(
                customer=customer_id,
                amount=int(tax_calc["gross_amount"] * 100),
                currency=currency.lower(),
                description="Service / Purchase (AT/EU)",
                idempotency_key=f"{base_key}:item"
            )
            invoice = stripe.Invoice.create(
                customer=customer_id,
                collection_method="send_invoice",
                days_until_due=14,
                idempotency_key=f"{base_key}:invoice"
            )
            invoice = stripe.Invoice.finalize_invoice(invoice.id)
            audit_log({**audit_base, "result": "executed", "invoice_id": invoice.id})
            return {
                "success": True,
                "mode": settings.stripe_mode,
                "operation": "create_invoice",
                "invoice_id": invoice.id,
                "hosted_invoice_url": invoice.hosted_invoice_url,
                "customer_id": customer_id,
                "tax_breakdown": tax_calc,
                "bao_compliance": {
                    "retention_years": 7,
                    "legal_basis": "§ 132 BAO (Bundesabgabenordnung)",
                },
                "status": invoice.status,
            }

        return {"success": True, "mode": settings.stripe_mode, "operation": operation.value, "tax_breakdown": tax_calc}
    except Exception as e:
        audit_log({**audit_base, "result": "error", "detail": str(e)})
        return {"success": False, "error": str(e)}
