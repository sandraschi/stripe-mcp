import argparse
import logging
from contextlib import asynccontextmanager
from typing import Annotated, Any, Dict, List, Optional

import uvicorn
from fastmcp import FastMCP
from pydantic import Field
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.routing import Mount, Route

from stripe_mcp.austria_tax import calculate_austrian_tax
from stripe_mcp.config import settings
from stripe_mcp.models import (
    AnalyticsMetric,
    AustrianVatType,
    CheckoutOp,
    CustomerOp,
    PaymentOp,
    SubscriptionOp,
)
from stripe_mcp.tools.analytics import handle_revenue_analytics
from stripe_mcp.tools.checkout import handle_manage_checkout
from stripe_mcp.tools.customers import handle_manage_customers
from stripe_mcp.tools.payments import handle_manage_payments
from stripe_mcp.tools.prefabs import (
    handle_show_customer_billing_health,
    handle_show_revenue_kpi_dashboard,
)
from stripe_mcp.tools.subscriptions import handle_manage_subscriptions
from stripe_mcp.webhook import get_recent_webhooks, process_webhook_payload

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("stripe_mcp.server")

@asynccontextmanager
async def server_lifespan(server: FastMCP):
    logger.info(f"Initializing stripe-mcp server (Mode: {settings.stripe_mode}, Mock: {settings.is_mock_mode})")
    # Lifespan shallow probe
    if not settings.is_mock_mode:
        try:
            import stripe
            stripe.api_key = settings.stripe_api_key
            stripe.Account.retrieve()
            logger.info("Stripe API connectivity probe successful.")
        except Exception as e:
            logger.warning(f"Stripe API probe warning: {e}. Falling back to safe operation.")
    else:
        logger.info("Operating in declared MOCK mode with sample data.")
    yield
    logger.info("Shutting down stripe-mcp server.")

mcp = FastMCP("stripe", lifespan=server_lifespan)

# Tool Registrations
@mcp.tool()
def manage_stripe_customers(
    operation: Annotated[CustomerOp, Field(description="Customer operation (list, get, create, update, search)")],
    customer_id: Annotated[Optional[str], Field(description="Stripe Customer ID (cus_...)")] = None,
    email: Annotated[Optional[str], Field(description="Customer email")] = None,
    name: Annotated[Optional[str], Field(description="Customer legal name")] = None,
    vat_id: Annotated[Optional[str], Field(description="EU/Austrian VAT ID (e.g., ATU12345678)")] = None,
    country: Annotated[Optional[str], Field(description="ISO 2-letter country code")] = None,
) -> Dict[str, Any]:
    """Manage Stripe customer records.

    ## Return Format
    Returns dictionary with operation results and customer data.

    ## Examples
    - `manage_stripe_customers(operation="list")`
    """
    return handle_manage_customers(operation, customer_id, email, name, vat_id, country)

@mcp.tool()
def manage_stripe_subscriptions(
    operation: Annotated[SubscriptionOp, Field(description="Subscription operation (list, get, cancel, pause, resume)")],
    subscription_id: Annotated[Optional[str], Field(description="Stripe Subscription ID (sub_...)")] = None,
    customer_id: Annotated[Optional[str], Field(description="Filter by customer ID")] = None,
) -> Dict[str, Any]:
    """Manage Stripe subscriptions.

    ## Return Format
    Returns subscription list or detailed item object.

    ## Examples
    - `manage_stripe_subscriptions(operation="list")`
    """
    return handle_manage_subscriptions(operation, subscription_id, customer_id)

@mcp.tool()
def manage_stripe_payments(
    operation: Annotated[PaymentOp, Field(description="Payment operation (list_charges, get_payment_intent, issue_refund, get_disputes)")],
    charge_id: Annotated[Optional[str], Field(description="Stripe Charge ID (ch_...)")] = None,
    payment_intent_id: Annotated[Optional[str], Field(description="Stripe PaymentIntent ID (pi_...)")] = None,
    amount: Annotated[Optional[float], Field(description="Refund amount in EUR")] = None,
    reason: Annotated[Optional[str], Field(description="Refund reason")] = None,
) -> Dict[str, Any]:
    """Manage Stripe charges, payment intents, refunds, and disputes with safety caps.

    ## Return Format
    Returns charge or refund transaction status.

    ## Examples
    - `manage_stripe_payments(operation="list_charges")`
    """
    return handle_manage_payments(operation, charge_id, payment_intent_id, amount, reason)

@mcp.tool()
def manage_stripe_checkout(
    operation: Annotated[CheckoutOp, Field(description="Checkout operation (create_payment_link, create_checkout_session, create_invoice)")],
    amount: Annotated[float, Field(description="Net amount in major currency units")],
    currency: Annotated[str, Field(description="Currency code (default EUR)")] = "EUR",
    payment_method_types: Annotated[Optional[List[str]], Field(description="Payment methods, e.g., ['card', 'eps', 'sepa_debit']")] = None,
    customer_id: Annotated[Optional[str], Field(description="Stripe Customer ID")] = None,
    customer_vat_id: Annotated[Optional[str], Field(description="Customer EU VAT ID (ATU...)")] = None,
    vat_type: Annotated[AustrianVatType, Field(description="Austrian VAT rate type")] = AustrianVatType.STANDARD_20,
) -> Dict[str, Any]:
    """Create Stripe Payment Links, Checkout Sessions, or Invoices with Austrian/EU tax calculation.

    ## Return Format
    Returns checkout URL or invoice object with tax breakdown.

    ## Examples
    - `manage_stripe_checkout(operation="create_payment_link", amount=99.00)`
    """
    return handle_manage_checkout(operation, amount, currency, payment_method_types, customer_id, customer_vat_id, vat_type)

@mcp.tool()
def stripe_revenue_analytics(
    metric: Annotated[AnalyticsMetric, Field(description="Metric (mrr, churn, disputes, vat_summary, all)")] = AnalyticsMetric.ALL
) -> Dict[str, Any]:
    """Retrieve Stripe revenue analytics, MRR, churn rate, and Austrian VAT summaries.

    ## Return Format
    Returns SaaS financial KPIs and tax collection totals.

    ## Examples
    - `stripe_revenue_analytics(metric="all")`
    """
    return handle_revenue_analytics(metric)

@mcp.tool()
def calculate_austrian_vat(
    amount: Annotated[float, Field(description="Net amount in EUR")],
    vat_type: Annotated[AustrianVatType, Field(description="VAT rate type (standard_20, reduced_10, reduced_13)")] = AustrianVatType.STANDARD_20,
    customer_vat_id: Annotated[Optional[str], Field(description="Optional ATU VAT ID for Reverse Charge check")] = None
) -> Dict[str, Any]:
    """Calculate Austrian VAT rates and verify EU ATU VAT IDs for Reverse Charge eligibility.

    ## Return Format
    Returns tax breakdown, gross total, and BAO § 132 compliance metadata.

    ## Examples
    - `calculate_austrian_vat(amount=100.00, customer_vat_id="ATU12345678")`
    """
    return calculate_austrian_tax(amount, vat_type=vat_type, customer_vat_id=customer_vat_id)

@mcp.tool(app=True)
def show_customer_billing_health(customer_id: Annotated[Optional[str], Field(description="Customer ID")] = "cus_at_101") -> Dict[str, Any]:
    """Prefab UI card showing customer billing health and active subscriptions."""
    return handle_show_customer_billing_health(customer_id)

@mcp.tool(app=True)
def show_revenue_kpi_dashboard() -> Dict[str, Any]:
    """Prefab UI card displaying MRR, active subscriber count, and Austrian VAT totals."""
    return handle_show_revenue_kpi_dashboard()


# REST Routes
async def health_endpoint(request: Request):
    return JSONResponse({
        "status": "ok",
        "service": "stripe-mcp",
        "mode": settings.stripe_mode,
        "is_mock_mode": settings.is_mock_mode,
        "read_only": settings.stripe_read_only,
        "version": "0.1.0"
    })

async def webhook_endpoint(request: Request):
    body = await request.body()
    sig = request.headers.get("stripe-signature", "")
    res = process_webhook_payload(body, sig, settings.stripe_webhook_secret)
    return JSONResponse(res, status_code=200 if res.get("success") else 400)

async def recent_webhooks_endpoint(request: Request):
    return JSONResponse({"webhooks": get_recent_webhooks()})

# Starlette App setup
routes = [
    Route("/api/health", health_endpoint, methods=["GET"]),
    Route("/api/webhooks/stripe", webhook_endpoint, methods=["POST"]),
    Route("/api/webhooks/recent", recent_webhooks_endpoint, methods=["GET"]),
    Mount("/", app=mcp._mcp_server)
]

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["http://127.0.0.1:11166", "http://localhost:11166", "http://127.0.0.1:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
]

app = Starlette(debug=True, routes=routes, middleware=middleware)

def main():
    parser = argparse.ArgumentParser(description="stripe-mcp server")
    parser.add_argument("--port", type=int, default=settings.port, help="Port to bind REST/MCP backend")
    args = parser.parse_args()

    logger.info(f"Starting stripe-mcp backend on http://127.0.0.1:{args.port}")
    uvicorn.run(app, host="127.0.0.1", port=args.port, log_level="info")

if __name__ == "__main__":
    main()
