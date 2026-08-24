from typing import Annotated, Any, Dict, Optional

from pydantic import Field

from stripe_mcp.config import settings
from stripe_mcp.models import SubscriptionOp

MOCK_SUBSCRIPTIONS = [
    {
        "id": "sub_at_901",
        "customer_id": "cus_at_101",
        "customer_name": "Sandra Mockinger",
        "plan_name": "Enterprise AI Suite (DACH)",
        "amount_eur": 299.00,
        "interval": "month",
        "status": "active",
        "current_period_end": 1750000000,
        "cancel_at_period_end": False
    },
    {
        "id": "sub_at_902",
        "customer_id": "cus_at_102",
        "customer_name": "Joe Mocky GmbH",
        "plan_name": "Standard Fleet Agent Plan",
        "amount_eur": 49.00,
        "interval": "month",
        "status": "active",
        "current_period_end": 1749000000,
        "cancel_at_period_end": False
    }
]

def handle_manage_subscriptions(
    operation: Annotated[SubscriptionOp, Field(description="Subscription operation enum (list, get, cancel, pause, resume)")],
    subscription_id: Annotated[Optional[str], Field(description="Stripe Subscription ID (sub_...)")] = None,
    customer_id: Annotated[Optional[str], Field(description="Filter by customer ID")] = None,
) -> Dict[str, Any]:
    """Manage Stripe subscriptions.

    ## Return Format
    Returns a dictionary containing `success: True`, `operation`, and subscription data or list.

    ## Examples
    - `manage_stripe_subscriptions(operation="list")`
    - `manage_stripe_subscriptions(operation="cancel", subscription_id="sub_at_901")`
    """
    if settings.is_mock_mode:
        if operation == SubscriptionOp.LIST:
            filtered = [s for s in MOCK_SUBSCRIPTIONS if not customer_id or s["customer_id"] == customer_id]
            return {"success": True, "mode": "MOCK", "operation": "list", "data": filtered, "count": len(filtered)}

        if operation == SubscriptionOp.GET:
            sid = subscription_id or "sub_at_901"
            found = next((s for s in MOCK_SUBSCRIPTIONS if s["id"] == sid), MOCK_SUBSCRIPTIONS[0])
            return {"success": True, "mode": "MOCK", "operation": "get", "data": found}

        if operation == SubscriptionOp.CANCEL:
            if settings.stripe_read_only:
                return {"success": False, "error": "STRIPE_READ_ONLY mode enabled. Mutation blocked."}
            sid = subscription_id or "sub_at_901"
            for s in MOCK_SUBSCRIPTIONS:
                if s["id"] == sid:
                    s["status"] = "canceled"
            return {"success": True, "mode": "MOCK", "operation": "cancel", "subscription_id": sid, "status": "canceled"}

        return {"success": True, "mode": "MOCK", "operation": operation.value, "data": {}}

    import stripe
    stripe.api_key = settings.stripe_api_key

    try:
        if operation == SubscriptionOp.LIST:
            res = stripe.Subscription.list(limit=20, customer=customer_id if customer_id else None)
            return {"success": True, "mode": settings.stripe_mode, "operation": "list", "data": [s.to_dict() for s in res.data]}
        if operation == SubscriptionOp.CANCEL:
            if settings.stripe_read_only:
                return {"success": False, "error": "STRIPE_READ_ONLY mode enabled."}
            res = stripe.Subscription.cancel(subscription_id)
            return {"success": True, "mode": settings.stripe_mode, "operation": "cancel", "data": res.to_dict()}
        return {"success": True, "mode": settings.stripe_mode, "operation": operation.value, "data": {}}
    except Exception as e:
        return {"success": False, "error": str(e)}
