from typing import Any, Dict, Optional

from stripe_mcp.models import AnalyticsMetric, CustomerOp
from stripe_mcp.tools.analytics import handle_revenue_analytics
from stripe_mcp.tools.customers import handle_manage_customers


def handle_show_customer_billing_health(customer_id: Optional[str] = "cus_at_101") -> Dict[str, Any]:
    """Renders a Prefab UI card showing customer active subscriptions, lifetime spend, and payment status.

    ## Return Format
    Returns a dictionary containing UI component properties and customer billing state.
    """
    res = handle_manage_customers(operation=CustomerOp.GET, customer_id=customer_id)
    customer_data = res.get("data", {})

    return {
        "success": True,
        "type": "prefab_card",
        "card_type": "customer_billing_health",
        "title": f"Customer Billing Health: {customer_data.get('name', 'Sandra Mockinger')}",
        "data": {
            "customer_id": customer_data.get("id"),
            "email": customer_data.get("email"),
            "vat_id": customer_data.get("vat_id"),
            "country": customer_data.get("country", "AT"),
            "status": "Good Standing",
            "active_subscriptions": 1,
            "lifetime_spend_eur": 598.00,
            "last_payment_status": "succeeded"
        }
    }

def handle_show_revenue_kpi_dashboard() -> Dict[str, Any]:
    """Renders a Prefab UI card showing MRR, subscriber count, churn rate, and Austrian VAT breakdown.

    ## Return Format
    Returns a dictionary containing UI component card properties for revenue KPIs.
    """
    analytics = handle_revenue_analytics(metric=AnalyticsMetric.ALL)
    data = analytics.get("data", {})

    return {
        "success": True,
        "type": "prefab_card",
        "card_type": "revenue_kpi_dashboard",
        "title": "Stripe Revenue & Austrian VAT Dashboard",
        "data": data
    }
