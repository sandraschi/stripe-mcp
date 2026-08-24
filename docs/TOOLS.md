# FastMCP Tools Reference — `stripe-mcp`

`stripe-mcp` exposes portmanteau functions to optimize agent tool usage:

---

## 1. `manage_stripe_customers`

Portmanteau tool for managing customer accounts.

- `operation`: Enum (`"list"`, `"get"`, `"create"`, `"update"`, `"search"`)
- `customer_id`: Optional Stripe Customer ID (`cus_...`)
- `email`: Customer email
- `name`: Customer name
- `vat_id`: Optional EU VAT ID (e.g., `ATU12345678`)
- `country`: Country code (e.g. `AT`)

---

## 2. `manage_stripe_subscriptions`

Portmanteau tool for subscription lifecycle management.

- `operation`: Enum (`"list"`, `"get"`, `"cancel"`, `"pause"`, `"resume"`)
- `subscription_id`: Stripe Subscription ID (`sub_...`)
- `customer_id`: Filter by customer

---

## 3. `manage_stripe_payments`

Portmanteau tool for charges, payment intents, refunds, and disputes.

- `operation`: Enum (`"list_charges"`, `"get_payment_intent"`, `"issue_refund"`, `"get_disputes"`)
- `charge_id` / `payment_intent_id`: Target transaction ID
- `amount`: Refund amount in major currency units (e.g. `50.00` EUR)
- `reason`: Refund rationale

---

## 4. `manage_stripe_checkout`

Portmanteau tool for creating checkout experiences and invoices.

- `operation`: Enum (`"create_payment_link"`, `"create_checkout_session"`, `"create_invoice"`)
- `amount`: Transaction amount
- `currency`: Currency code (default `EUR`)
- `payment_method_types`: List of payment methods (e.g. `["card", "eps", "sepa_debit"]`)
- `customer_id`: Associated customer ID
- `vat_rate`: Applicable VAT rate (e.g. `0.20` for Austria)

---

## 5. `stripe_revenue_analytics`

Fetches revenue KPIs and Austrian VAT summaries.

- `metric`: Enum (`"mrr"`, `"churn"`, `"disputes"`, `"vat_summary"`, `"all"`)

---

## 6. `calculate_austrian_vat`

Utility tool for calculating Austrian VAT and verifying VAT IDs.

- `amount`: Net transaction amount
- `vat_type`: Enum (`"standard_20"`, `"reduced_10"`, `"reduced_13"`)
- `vat_id`: Optional EU VAT ID to check for Reverse Charge eligibility

---

## Prefab UI Cards (`@mcp.tool(app=True)`)

- `show_customer_billing_health`: Renders an interactive card showing customer active subs, lifetime spend, and payment status.
- `show_revenue_kpi_dashboard`: Renders MRR, subscriber count, churn rate, and VAT breakdown.
