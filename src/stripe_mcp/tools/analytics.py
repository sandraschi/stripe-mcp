from typing import Annotated, Any, Dict

from pydantic import Field

from stripe_mcp.config import settings
from stripe_mcp.models import AnalyticsMetric


def handle_revenue_analytics(
    metric: Annotated[AnalyticsMetric, Field(description="Analytics metric (mrr, churn, disputes, vat_summary, all)")] = AnalyticsMetric.ALL
) -> Dict[str, Any]:
    """Retrieve Stripe revenue analytics, MRR metrics, churn rate, and Austrian VAT summaries.

    ## Return Format
    Returns a dictionary containing key SaaS revenue performance indicators and tax totals.

    ## Examples
    - `stripe_revenue_analytics(metric="mrr")`
    - `stripe_revenue_analytics(metric="all")`
    """
    if settings.is_mock_mode:
        mrr_eur = 348.00
        arr_eur = mrr_eur * 12
        active_subscriptions = 2
        churn_rate_percent = 1.2
        active_disputes = 0
        vat_collected_month_eur = round(mrr_eur * 0.20, 2)

        data = {
            "mrr_eur": mrr_eur,
            "arr_eur": arr_eur,
            "active_subscriptions": active_subscriptions,
            "churn_rate_percent": churn_rate_percent,
            "active_disputes": active_disputes,
            "austrian_vat_summary": {
                "currency": "EUR",
                "vat_collected_current_month": vat_collected_month_eur,
                "reverse_charge_b2b_sales_eur": 150.00,
                "bao_compliance_status": "compliant"
            }
        }

        if metric == AnalyticsMetric.MRR:
            return {"success": True, "mode": "MOCK", "metric": "mrr", "mrr_eur": mrr_eur, "arr_eur": arr_eur}
        if metric == AnalyticsMetric.VAT_SUMMARY:
            return {"success": True, "mode": "MOCK", "metric": "vat_summary", "vat_summary": data["austrian_vat_summary"]}

        return {"success": True, "mode": "MOCK", "metric": metric.value, "data": data}

    import stripe
    stripe.api_key = settings.stripe_api_key

    try:
        subs = stripe.Subscription.list(status="active", limit=100)
        total_mrr_cents = sum(item["items"]["data"][0]["price"]["unit_amount"] for item in subs.data if item["items"]["data"])
        mrr_eur = total_mrr_cents / 100.0

        return {
            "success": True,
            "mode": settings.stripe_mode,
            "metric": metric.value,
            "data": {
                "mrr_eur": mrr_eur,
                "arr_eur": mrr_eur * 12,
                "active_subscriptions": len(subs.data)
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
