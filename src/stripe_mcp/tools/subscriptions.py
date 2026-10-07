from typing import Annotated, Any, Dict, Optional

from fastmcp import Context
from pydantic import Field

from stripe_mcp.config import settings
from stripe_mcp.models import SubscriptionOp
from stripe_mcp.safety import audit_log, confirm_write, is_observed, mark_observed

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

async def handle_manage_subscriptions(
    operation: Annotated[SubscriptionOp, Field(description="Subscription operation enum (list, get, cancel, pause, resume)")],
    subscription_id: Annotated[Optional[str], Field(description="Stripe Subscription ID (sub_...)")] = None,
    customer_id: Annotated[Optional[str], Field(description="Filter by customer ID")] = None,
    ctx: Optional[Context] = None,
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
            subs = [s.to_dict() for s in res.data]
            for s in subs:
                await mark_observed(ctx, "subscription", s.get("id"))
            return {"success": True, "mode": settings.stripe_mode, "operation": "list", "data": subs}

        if operation == SubscriptionOp.CANCEL:
            audit_base = {"tool": "manage_stripe_subscriptions", "operation": "cancel", "subscription_id": subscription_id}

            if settings.stripe_read_only:
                audit_log({**audit_base, "result": "blocked_read_only"})
                return {"success": False, "error": "STRIPE_READ_ONLY mode enabled."}

            if settings.require_observed_ids and not await is_observed(ctx, "subscription", subscription_id):
                audit_log({**audit_base, "result": "blocked_unobserved_target"})
                return {
                    "success": False,
                    "error": (
                        f"UnobservedTarget: subscription_id '{subscription_id}' was not returned by a "
                        "list call in this session. Call manage_stripe_subscriptions(operation=\"list\") "
                        "first, or set STRIPE_REQUIRE_OBSERVED_IDS=false to disable this check."
                    ),
                }

            confirmed, confirm_error = await confirm_write(ctx, f"Cancel live subscription {subscription_id}?")
            if not confirmed:
                audit_log({**audit_base, "result": "blocked_not_confirmed", "detail": confirm_error})
                return {"success": False, "error": f"NotConfirmed: {confirm_error}"}

            res = stripe.Subscription.cancel(subscription_id)
            audit_log({**audit_base, "result": "executed"})
            return {"success": True, "mode": settings.stripe_mode, "operation": "cancel", "data": res.to_dict()}

        return {"success": True, "mode": settings.stripe_mode, "operation": operation.value, "data": {}}
    except Exception as e:
        return {"success": False, "error": str(e)}
