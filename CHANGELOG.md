# Changelog — `stripe-mcp`

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-08-24

### Added
- FastMCP 3.4+ server with HTTP `/mcp` and Starlette REST endpoints (`GET /api/health`, `POST /api/webhooks/stripe`).
- Portmanteau tools: `manage_stripe_customers`, `manage_stripe_subscriptions`, `manage_stripe_payments`, `manage_stripe_checkout`, `stripe_revenue_analytics`, `calculate_austrian_vat`.
- Prefab `@mcp.tool(app=True)` UI cards for Customer Billing Health, Subscription Overview, and Revenue KPIs.
- Built-in Austrian VAT calculation (20% standard, 10%/13% reduced), EU ATU VAT verification, and BAO § 132 fiscal invoice retention schema.
- PSD2 3D Secure 2 (3DS2) async challenge links and EPS / SEPA Direct Debit checkout options.
- SOTA React webapp dashboard on port 11166 featuring catch-them-all pages: Dashboard hero+KPIs with mock-until-onboarded state, Customer Studio, Subscriptions, Invoices, Payments, Checkout Generator, Webhook Inbox, Tools, Skills, Chat, Settings, Help, and Logs.
- Automated test suite (`pytest`) and local CI workflow (`just ci`).
