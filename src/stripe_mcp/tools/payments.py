from typing import Annotated, Any, Dict, Optional

from pydantic import Field

from stripe_mcp.config import settings
from stripe_mcp.models import PaymentOp

MOCK_CHARGES = [
    {
        "id": "ch_at_501",
        "customer_id": "cus_at_101",
        "customer_name": "Sandra Mockinger",
        "amount_eur": 299.00,
        "status": "succeeded",
        "payment_method": "card",
        "created": 1700000000,
        "receipt_url": "https://pay.stripe.com/receipts/acct_mock/ch_at_501"
    },
    {
        "id": "ch_at_502",
        "customer_id": "cus_at_102",
        "customer_name": "Joe Mocky GmbH",
        "amount_eur": 49.00,
        "status": "succeeded",
        "payment_method": "eps",
        "created": 1700100000,
        "receipt_url": "https://pay.stripe.com/receipts/acct_mock/ch_at_502"
    }
]

def handle_manage_payments(
    operation: Annotated[PaymentOp, Field(description="Payment operation enum (list_charges, get_payment_intent, issue_refund, get_disputes)")],
    charge_id: Annotated[Optional[str], Field(description="Stripe Charge ID (ch_...)")] = None,
    payment_intent_id: Annotated[Optional[str], Field(description="Stripe PaymentIntent ID (pi_...)")] = None,
    amount: Annotated[Optional[float], Field(description="Refund amount in EUR")] = None,
    reason: Annotated[Optional[str], Field(description="Refund rationale (requested_by_customer, duplicate, fraudulent)")] = None,
) -> Dict[str, Any]:
    """Manage Stripe charges, payment intents, refunds, and disputes.

    ## Return Format
    Returns a dictionary containing `success: True`, `operation`, and charge/refund details.

    ## Examples
    - `manage_stripe_payments(operation="list_charges")`
    - `manage_stripe_payments(operation="issue_refund", charge_id="ch_at_501", amount=50.00, reason="requested_by_customer")`
    """
    if settings.is_mock_mode:
        if operation == PaymentOp.LIST_CHARGES:
            return {"success": True, "mode": "MOCK", "operation": "list_charges", "data": MOCK_CHARGES, "count": len(MOCK_CHARGES)}

        if operation == PaymentOp.ISSUE_REFUND:
            if settings.stripe_read_only:
                return {"success": False, "error": "STRIPE_READ_ONLY mode enabled. Refund blocked."}
            refund_amt = amount or 49.00
            if refund_amt > settings.max_refund_amount_eur:
                return {
                    "success": False,
                    "error": f"SafetyCapExceeded: Refund amount (€{refund_amt:.2f}) exceeds configured agent safety limit of €{settings.max_refund_amount_eur:.2f}."
                }
            return {
                "success": True,
                "mode": "MOCK",
                "operation": "issue_refund",
                "refund_id": f"re_mock_{charge_id or '501'}",
                "charge_id": charge_id or "ch_at_501",
                "amount_refunded_eur": refund_amt,
                "status": "succeeded",
                "reason": reason or "requested_by_customer"
            }

        if operation == PaymentOp.GET_DISPUTES:
            return {"success": True, "mode": "MOCK", "operation": "get_disputes", "data": [], "count": 0, "status": "No active disputes"}

        return {"success": True, "mode": "MOCK", "operation": operation.value, "data": {}}

    import stripe
    stripe.api_key = settings.stripe_api_key

    try:
        if operation == PaymentOp.LIST_CHARGES:
            res = stripe.Charge.list(limit=20)
            return {"success": True, "mode": settings.stripe_mode, "operation": "list_charges", "data": [c.to_dict() for c in res.data]}
        if operation == PaymentOp.ISSUE_REFUND:
            if settings.stripe_read_only:
                return {"success": False, "error": "STRIPE_READ_ONLY mode enabled."}
            refund_amt = amount or 0.0
            if refund_amt > settings.max_refund_amount_eur:
                return {"success": False, "error": f"SafetyCapExceeded: Max EUR {settings.max_refund_amount_eur:.2f} limit."}
            res = stripe.Refund.create(charge=charge_id, amount=int(refund_amt * 100), reason=reason)
            return {"success": True, "mode": settings.stripe_mode, "operation": "issue_refund", "data": res.to_dict()}
        return {"success": True, "mode": settings.stripe_mode, "operation": operation.value, "data": {}}
    except Exception as e:
        return {"success": False, "error": str(e)}
