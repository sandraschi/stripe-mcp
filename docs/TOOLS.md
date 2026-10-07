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

🔒 `create` is blocked when `STRIPE_READ_ONLY=true` (default), and against a real
Stripe account requires interactive human confirmation (see
[SAFETY.md](SAFETY.md#5-human-confirmation-before-every-real-write-elicitation)).
`list`/`get`/`search` are always available.

---

## 2. `manage_stripe_subscriptions`

Portmanteau tool for subscription lifecycle management.

- `operation`: Enum (`"list"`, `"get"`, `"cancel"`, `"pause"`, `"resume"`)
- `subscription_id`: Stripe Subscription ID (`sub_...`)
- `customer_id`: Filter by customer

🔒 `cancel` is blocked when `STRIPE_READ_ONLY=true` (default). Against a real Stripe
account it additionally requires the subscription to have been returned by a `list`
call earlier in this same session (`STRIPE_REQUIRE_OBSERVED_IDS`, default on), plus
interactive human confirmation. See [SAFETY.md](SAFETY.md).

---

## 3. `manage_stripe_payments`

Portmanteau tool for charges, payment intents, refunds, and disputes.

- `operation`: Enum (`"list_charges"`, `"get_payment_intent"`, `"issue_refund"`, `"get_disputes"`)
- `charge_id` / `payment_intent_id`: Target transaction ID
- `amount`: Refund amount in major currency units (e.g. `50.00` EUR)
- `reason`: Refund rationale

🔒 `issue_refund` is blocked when `STRIPE_READ_ONLY=true` (default), capped at both
`MAX_REFUND_AMOUNT_EUR` per call and `MAX_REFUND_TOTAL_EUR_PER_DAY` in aggregate, and
sent with a deterministic idempotency key (hash of charge/amount/reason) so a network
retry can't create a duplicate refund. Against a real Stripe account it additionally
requires the charge to have been returned by a `list_charges` call earlier in this
same session, plus interactive human confirmation before it executes. Full detail:
[SAFETY.md](SAFETY.md).

---

## 4. `manage_stripe_checkout`

Portmanteau tool for creating checkout experiences and invoices.

- `operation`: Enum (`"create_payment_link"`, `"create_checkout_session"`, `"create_invoice"`)
- `amount`: Transaction amount
- `currency`: Currency code (default `EUR`)
- `payment_method_types`: List of payment methods (e.g. `["card", "eps", "sepa_debit"]`)
- `customer_id`: Associated customer ID — **required** for `create_invoice` against a
  real Stripe account (Stripe invoices must be attached to an existing customer);
  optional for the other two operations and in mock mode
- `vat_type`: Applicable Austrian VAT rate type (`standard_20`, `reduced_10`, `reduced_13`)

🔒 Every operation in this tool creates a real, payable Stripe object — there is no
read-only op, and all three operations call the real Stripe API against a live/test
key (`checkout.Session.create`, `PaymentLink.create`, `InvoiceItem.create` +
`Invoice.create` + `Invoice.finalize_invoice` respectively). The whole tool is blocked
when `STRIPE_READ_ONLY=true` (default) and capped at both `MAX_CHECKOUT_AMOUNT_EUR`
per call and `MAX_CHECKOUT_TOTAL_EUR_PER_DAY` in aggregate. The live
`create_checkout_session` and `create_payment_link` calls carry a deterministic
idempotency key to prevent duplicates on retry, and every real-mode call requires
interactive human confirmation before executing. Full detail: [SAFETY.md](SAFETY.md).

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
