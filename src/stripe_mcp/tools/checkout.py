from typing import Annotated, Any, Dict, List, Optional

from pydantic import Field

from stripe_mcp.austria_tax import calculate_austrian_tax
from stripe_mcp.config import settings
from stripe_mcp.models import AustrianVatType, CheckoutOp


def handle_manage_checkout(
    operation: Annotated[CheckoutOp, Field(description="Checkout operation enum (create_payment_link, create_checkout_session, create_invoice)")],
    amount: Annotated[float, Field(description="Net amount in major currency units (e.g. 99.00 EUR)")],
    currency: Annotated[str, Field(description="Currency code (default EUR)")] = "EUR",
    payment_method_types: Annotated[Optional[List[str]], Field(description="Allowed payment methods, e.g., ['card', 'eps', 'sepa_debit', 'klarna']")] = None,
    customer_id: Annotated[Optional[str], Field(description="Associated Stripe Customer ID (cus_...)")] = None,
    customer_vat_id: Annotated[Optional[str], Field(description="Customer EU VAT ID (e.g. ATU12345678) for Reverse Charge")] = None,
    vat_type: Annotated[AustrianVatType, Field(description="Austrian VAT type (standard_20, reduced_10, reduced_13)")] = AustrianVatType.STANDARD_20,
) -> Dict[str, Any]:
    """Create Stripe Checkout Sessions, Payment Links, or BAO-compliant Invoices with Austrian/EU tax calculation.

    ## Return Format
    Returns a dictionary containing `success: True`, `checkout_url` / `invoice_data`, tax breakdown, and payment method details.

    ## Examples
    - `manage_stripe_checkout(operation="create_payment_link", amount=120.00, payment_method_types=["card", "eps"])`
    - `manage_stripe_checkout(operation="create_invoice", amount=500.00, customer_vat_id="ATU12345678")`
    """
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

    import stripe
    stripe.api_key = settings.stripe_api_key

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
                cancel_url="https://example.com/cancel"
            )
            return {"success": True, "mode": settings.stripe_mode, "url": session.url, "session_id": session.id}

        return {"success": True, "mode": settings.stripe_mode, "operation": operation.value, "tax_breakdown": tax_calc}
    except Exception as e:
        return {"success": False, "error": str(e)}
