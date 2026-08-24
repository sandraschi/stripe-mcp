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
- **Safety Cap (`MAX_REFUND_AMOUNT_EUR`)**: Hard limit (default €500.00) preventing programmatic refund overruns by AI agents.
- **Read-Only Mode (`STRIPE_READ_ONLY=true`)**: Blocks all mutating actions during evaluation or staging tests.
- **Restricted API Keys (`rk_live_...`)**: Least privilege access — root secret keys (`sk_live_...`) must never be used.
- **Immutable Audit Logs**: All agent actions are timestamped and logged on port `11166` `/logs`.

## 7. Paying vs Receiving Payments (Inbound vs Outbound)
- **Receiving Money (Inbound Revenue)**:
  - Stripe Checkout Sessions (Credit Cards, EPS, SEPA Direct Debit).
  - Recurring SaaS Subscriptions.
  - Invoice generation with 20%/10%/13% domestic Austrian VAT or 0% B2B Reverse Charge.
- **Paying Money (Outbound & Payouts)**:
  - Policy-bounded Customer Refunds (capped at `MAX_REFUND_AMOUNT_EUR`).
  - Automated Bank Payouts to corporate Austrian IBAN accounts.
  - Connect vendor payouts and split revenue share transfers.
