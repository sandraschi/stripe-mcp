# Configuration Reference — `stripe-mcp`

> See [`SAFETY.md`](SAFETY.md) for the full threat model and rationale behind every
> setting below that gates a write operation.

All environment variables supported by `stripe-mcp`:

| Environment Variable | Type | Default | Description |
|---|---|---|---|
| `PORT` | Integer | `11165` | Backend Starlette API & FastMCP server port |
| `WEB_PORT` | Integer | `11166` | Frontend Vite React dashboard port |
| `STRIPE_API_KEY` | String | `rk_test_mock...` | Stripe Restricted Key (`rk_test_...` or `rk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | String | `whsec_mock...` | Webhook endpoint secret from Stripe Dashboard |
| `STRIPE_MODE` | Enum | `test` | Operating environment (`test` or `live`) |
| `STRIPE_READ_ONLY` | Boolean | **`true`** | Blocks every mutating operation: `issue_refund`, subscription `cancel`, customer `create`, and all of `manage_stripe_checkout` (payment links, checkout sessions, invoices). Set to `false` only when you deliberately want the agent able to move money or create live Stripe objects. |
| `MAX_REFUND_AMOUNT_EUR` | Float | `500.00` | Per-call hard cap on `issue_refund`, enforced in application code regardless of `STRIPE_READ_ONLY` |
| `MAX_CHECKOUT_AMOUNT_EUR` | Float | `5000.00` | Per-call hard cap on `manage_stripe_checkout`, enforced the same way |
| `MAX_REFUND_TOTAL_EUR_PER_DAY` | Float | `2000.00` | Rolling-daily aggregate cap across all refunds (catches many-small-calls abuse a per-call cap misses); real-mode only |
| `MAX_CHECKOUT_TOTAL_EUR_PER_DAY` | Float | `20000.00` | Rolling-daily aggregate cap across all checkout/invoice creation; real-mode only |
| `STRIPE_REQUIRE_OBSERVED_IDS` | Boolean | `true` | When `true`, `issue_refund` and subscription `cancel` may only target an ID this session actually saw via a prior `list`/`list_charges` call; real-mode only. See [`SAFETY.md`](SAFETY.md#4-observed-id-scoping-stripe_require_observed_ids-default-true) for the false-positive tradeoff before disabling |
| `DEFAULT_CURRENCY` | String | `EUR` | ISO currency code (default Euro) |
| `DEFAULT_COUNTRY` | String | `AT` | Country code (default Austria) |
| `DEFAULT_VAT_RATE` | Float | `0.20` | Standard VAT rate for Austria (20%) |
| `ENABLE_EU_VAT_VALIDATION` | Boolean | `true` | Enables ATU / EU VAT ID syntax & VIES checks |

## Gating model

`STRIPE_READ_ONLY` is checked in application code (not just tool descriptions), so a
blocked call fails even if a client ignores the docstring warning. It does **not**
change which tools are visible to the agent — `manage_stripe_checkout` and the write
branches of `manage_stripe_customers`/`manage_stripe_payments`/`manage_stripe_subscriptions`
are always listed; calling them under the default config returns
`{"success": false, "error": "STRIPE_READ_ONLY mode enabled..."}` instead of executing.
The two per-call amount caps (`MAX_REFUND_AMOUNT_EUR`, `MAX_CHECKOUT_AMOUNT_EUR`) and
the two daily aggregate caps apply even with `STRIPE_READ_ONLY=false` — there is no
env var to disable them short of editing the source.

Two further controls apply to every real (non-mock) write and have **no env var at
all** — they are not optional: a deterministic idempotency key on the live refund and
checkout-session calls, and a mid-call human confirmation request (MCP elicitation)
that fails closed if the client can't answer it. Full detail: [`SAFETY.md`](SAFETY.md).

Every write attempt, blocked or executed, is appended to `data/audit_log.jsonl` and
readable via `GET /api/audit/recent`.
