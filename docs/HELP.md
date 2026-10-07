# stripe-mcp Comprehensive System & Onboarding Guide

## 1. What is Stripe?
Stripe is a global payment processing gateway and financial platform. It allows businesses, websites, and autonomous software applications to accept credit card payments, EPS online banking transfers, SEPA Direct Debits, manage SaaS subscriptions, issue PDF invoices, and process payouts to corporate bank accounts.

## 2. What is `stripe-mcp`?
`stripe-mcp` is an enterprise FastMCP 3.4+ server paired with a SOTA React webapp running on port `11166` (Backend on port `11165`). It connects AI coding agents (such as Claude Desktop, Antigravity IDE, and OpenManus) directly to Stripe's billing and tax engine.

### Key Tools:
- `manage_stripe_customers`: Customer CRUD, search, and ATU VAT ID assignment.
- `manage_stripe_subscriptions`: Subscription plan lifecycle (list, pause, resume, cancel).
- `manage_stripe_payments`: Charge inspection, 3DS2 lookups, policy-bounded refunds.
- `manage_stripe_checkout`: Payment Links, Checkout Sessions, and BAO § 132 PDF invoices.
- `stripe_revenue_analytics`: SaaS metrics (MRR, Churn rate, Austrian VAT summary).
- `calculate_austrian_vat`: 20%/10%/13% VAT rates & ATU Reverse Charge zero-rating.

## 3. Do You Need a GmbH to Use Stripe in Austria?

**NO — Absolutely not.** You do not need a GmbH to register or use Stripe. Stripe accepts several Austrian legal business structures:

| Business Entity Type | Target Users | Verification Documents Needed |
|---|---|---|
| **Einzelunternehmen (Individual / Sole Proprietor)** | Freelancers (*Freiberufler*), solo developers, or unregistered sole traders. | Passport/ID + recent Meldezettel (< 3-6 mos) + personal Steuernummer & IBAN. **Requires only 1 person.** |
| **Eingetragenes Einzelunternehmen (e.U.)** | Sole trader registered in Commercial Register (*Firmenbuch*). | Personal ID + *Firmenbuch* registration number. |
| **GmbH / FlexCo / AG** | Incorporated limited liability companies. | *Firmenbuchauszug* + UID / ATU Number + ID & address verification for **all UBOs (>25% shares)**. |
| **OG / KG / Verein** | Partnerships or registered non-profit associations (*Verein*). | Partnership agreement or ZVR number (*Zentrales Vereinsregister*). |

## 4. Stripe Austria Verification & Onboarding Regulations (Brother Steve's Fact-Check)

### Single Person vs. Multi-Person Verification
- **Einzelunternehmen (Sole Proprietor / Individual)**: **Only 1 person is needed** (yourself).
- **GmbH / Partnerships**: Under EU 5th AML Directives, Stripe must verify the Account Representative AND all **Ultimate Beneficial Owners (UBOs)** holding **>25% of company shares** or serving as co-directors (*Geschäftsführer*). For standard corporate entities (e.g. GmbH with 2 co-founders), **both persons must submit identity & address verification**.

### Proof of Address (Meldezettel / Meldebestätigung Rules)
- **Recency Requirement**: Official address proof (*Meldezettel*, *Meldebestätigung*, bank statement, or utility bill) must be fresh (**strictly dated within the last 3 to 6 months**).
- **Two-Document Rule**: You **cannot** use the same document for photo ID and proof of address. If a Passport or Driver's License is uploaded as photo ID, a separate document (recent Meldezettel or bank statement) must be uploaded for home address proof.

## 5. How will `stripe-mcp` be used by other fleet apps in the future?
`stripe-mcp` serves as the central payment and billing authority across all 213 repositories in our workspace (`myai`, `deepfang`, `openclaw-molt-mcp`, `speechnotes`, etc.):
- **Unified Billing Endpoint**: Other fleet apps invoke `http://127.0.0.1:11165/mcp` to create checkout links or verify active subscriptions without duplicating Stripe credentials.
- **Metered API Token Consumption**: Subagents log usage and initiate top-up payment sessions through `stripe-mcp`.
- **Centralized Austrian Tax Filings**: All customer invoices across fleet apps pass through `stripe-mcp` for unified monthly BMD / RZL tax export generation.

## 6. Safety Considerations & Guardrails

**Read-only by default.** `STRIPE_READ_ONLY=true` is the shipped default, not an
opt-in. Every mutating path — `issue_refund`, subscription `cancel`, customer
`create`, and all three `manage_stripe_checkout` operations (payment links, checkout
sessions, invoices) — is blocked until someone deliberately sets
`STRIPE_READ_ONLY=false`. This matters specifically because an MCP server sits behind
an LLM: prompt injection from any untrusted content the agent reads (a scraped page,
an inbound email, a WhatsApp message) can attempt to call a tool. Blocking by default
means that attempt fails closed instead of needing a human to notice and intervene.

Beyond that master switch, every real (non-mock) write goes through four more layers
before it executes — full detail and rationale in
[`SAFETY.md`](SAFETY.md), the canonical reference:

- **Per-call and daily-aggregate amount caps** (`MAX_REFUND_AMOUNT_EUR` /
  `MAX_REFUND_TOTAL_EUR_PER_DAY`, `MAX_CHECKOUT_AMOUNT_EUR` /
  `MAX_CHECKOUT_TOTAL_EUR_PER_DAY`) — the daily cap catches "many calls under the
  per-call limit" abuse that the per-call cap alone can't.
- **Observed-ID scoping** (`STRIPE_REQUIRE_OBSERVED_IDS`, default on) — a refund or
  subscription cancel can only target an ID this session actually saw returned by a
  prior read call, not one an injected instruction supplied out of nowhere.
- **Human confirmation via MCP elicitation** — every real write pauses mid-call for an
  explicit human yes/no before executing, and fails closed (blocks the write) if the
  client can't answer.
- **Idempotency keys** on the two live money-moving Stripe calls (`Refund.create`,
  `checkout.Session.create`) — a network retry replays the same key instead of
  creating a duplicate refund or session.

Plus:

- **Restricted API Keys (`rk_live_...`)**: Least privilege access — root secret keys
  (`sk_live_...`) must never be used. A startup canary probe warns if the configured
  key can reach resources (Payouts) this app never touches.
- **Mock-mode by default**: with no real API key configured, every tool runs against
  synthetic data — nothing touches a real Stripe account until `STRIPE_API_KEY` is
  set, and none of the four layers above add friction to mock-mode demos.
- **Durable audit trail**: every write attempt, blocked or executed, is appended to
  `data/audit_log.jsonl` and readable via `GET /api/audit/recent` — this survives a
  restart, unlike an in-memory log.

See [CONFIGURATION.md](CONFIGURATION.md#gating-model) for exactly which operations
each setting blocks.

## 6a. How this compares to the official Stripe MCP

Stripe ships its own hosted MCP server at `mcp.stripe.com` (verified against
[docs.stripe.com/mcp](https://docs.stripe.com/mcp), 2026-09-02 — check that page for
what's changed since). It's a different design point, not a strictly better or worse
one:

| | `stripe-mcp` (this repo) | Official (`mcp.stripe.com`) |
|---|---|---|
| **Maintainer / trust** | Solo project | Stripe |
| **Auth** | Restricted API key only | OAuth (revocable per-session in the Stripe Dashboard) or restricted key |
| **Write surface** | 4 fixed, narrow tools (customers, subscriptions, payments, checkout) | `stripe_api_write` — one generic tool that can call **any** Stripe write endpoint (POST/PATCH/PUT/DELETE) across the entire API |
| **Amount caps** | `MAX_REFUND_AMOUNT_EUR`, `MAX_CHECKOUT_AMOUNT_EUR`, enforced in code | None documented — no built-in ceiling on a refund or write amount |
| **Read-only switch** | `STRIPE_READ_ONLY`, defaults on, enforced server-side | No equivalent for agent calls; access is toggled per live/sandbox mode from the Dashboard, not scoped per write-amount or per-call |
| **Prompt-injection mitigation** | Fails closed by default (see above) | Stripe's own docs: *"Enable human confirmation of tools, and be careful when combining Stripe MCP with other servers, to avoid prompt injection attacks"* — the mitigation is pushed to the client's approval UI, not built into the server |
| **Idempotency keys on writes** | Yes, on refund and checkout session creation | Not documented |
| **EU/Austrian tax logic (VAT, BAO §132, Reverse Charge)** | Built in (`austria_tax.py`, `calculate_austrian_vat`) | Generic Tax API pass-through only, no jurisdiction-specific logic |
| **Dashboard / Prefab UI** | React webapp + 2 Prefab UI cards | None |
| **API surface breadth** | 4 domains (customers, subscriptions, payments, checkout) | Nearly the full Stripe API (100+ resources) via `stripe_api_read`/`stripe_api_write`, plus analytics, treasury, docs search |

**The honest takeaway:** the official server is the safer default for broad,
general-purpose Stripe access precisely because it's maintained by Stripe and uses
revocable OAuth — but its write path is a single unscoped `stripe_api_write` tool
with no amount cap, and Stripe's own documentation places the injection-safety burden
on the *client* ("enable human confirmation"), not the server. This repo trades that
breadth for a narrower, capped, fail-closed-by-default write surface plus domain logic
(Austrian/EU tax compliance) the official server doesn't attempt. If you need
broad live-account access, prefer the official server with tool-call confirmation
switched on in your MCP client. If you specifically need BAO/VAT-aware invoicing and
want the smallest possible blast radius for an agent that also touches untrusted
input, this repo's tighter, capped surface is the better fit — provided
`STRIPE_READ_ONLY` stays on except when a human is deliberately enabling writes.

## 7. Paying vs Receiving Payments (Inbound vs Outbound)
- **Receiving Money (Inbound Revenue)**:
  - Stripe Checkout Sessions (Credit Cards, EPS, SEPA Direct Debit).
  - Recurring SaaS Subscriptions.
  - Invoice generation with 20%/10%/13% domestic Austrian VAT or 0% B2B Reverse Charge.
- **Paying Money (Outbound & Payouts)**:
  - Policy-bounded Customer Refunds (capped at `MAX_REFUND_AMOUNT_EUR`).
  - Automated Bank Payouts to corporate Austrian IBAN accounts.
  - Connect vendor payouts and split revenue share transfers.
