# stripe-mcp Core Backend Package (`src/stripe_mcp`)

The `stripe_mcp` Python package provides the core FastMCP 3.4+ server, Austrian/EU tax compliance engine, webhook listener, and portmanteau tool implementations.

## Directory Structure

```text
src/stripe_mcp/
├── __init__.py       # Package initialization
├── config.py         # Pydantic settings & environment configuration
├── models.py         # Enums & Pydantic models for customers, payments, taxes
├── austria_tax.py    # Austrian VAT calculator (20%/10%/13%) & ATU VAT ID validator
├── webhook.py        # Webhook payload signature verification & event queue
├── server.py         # FastMCP 3.4+ server & Starlette REST API endpoints
└── tools/            # Portmanteau tool implementations
    ├── __init__.py
    ├── customers.py  # manage_stripe_customers
    ├── subscriptions.py # manage_stripe_subscriptions
    ├── payments.py   # manage_stripe_payments & refund safety caps
    ├── checkout.py   # manage_stripe_checkout & BAO § 132 fiscal invoices
    ├── analytics.py  # stripe_revenue_analytics
    └── prefabs.py    # Prefab UI card renderers
```

## Key Engine Features

- **Austrian Tax Engine (`austria_tax.py`)**:
  - `20.0%` standard rate (digital SaaS, software, consulting).
  - `10.0%` & `13.0%` reduced rates (e-books, publications, lodging).
  - Reverse Charge zero-rating upon verification of valid ATU VAT number (`ATU\d{8}`).
  - BAO § 132 fiscal invoice metadata generation with statutory 7-year lock flag.
- **Safety Cap Guardrail (`tools/payments.py`)**:
  - Rejects automated refund executions exceeding `MAX_REFUND_AMOUNT_EUR` limit (default €500.00).
- **REST Endpoints (`server.py`)**:
  - `GET /api/health`: Health probe & mode status.
  - `POST /api/webhooks/stripe`: Stripe webhook listener.
  - `GET /api/webhooks/recent`: Event history stream for webapp Inbox.
  - `MOUNT /mcp`: FastMCP 3.4+ endpoint.
