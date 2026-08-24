# Onboarding Guide — `stripe-mcp`

This guide takes you from an unconfigured `stripe-mcp` server to a fully authenticated Stripe payment integration with Austrian/EU tax compliance.

---

## 1. Overview & Operating Modes

`stripe-mcp` operates in two modes:

1. **MOCK Mode (Default when unconfigured)**:
   - Active when no API key is provided (`STRIPE_API_KEY=rk_test_mock...`).
   - Generates simulated Austrian & EU customers, MRR metrics, invoices, and payment links.
   - Ideal for testing agent interactions without live network requests or real credit cards.

2. **LIVE / TEST Mode**:
   - Activated when a valid Stripe Restricted API Key is set in `.env`.
   - Communicates directly with Stripe's API.

---

## 2. Obtaining a Stripe Restricted API Key

For maximum security, **do not use your root secret key** (`sk_live_...`). Use a **Restricted API Key**:

1. Log into your [Stripe Dashboard](https://dashboard.stripe.com/).
2. Navigate to **Developers** > **API keys**.
3. Click **Create restricted key**.
4. Name the key (e.g. `antigravity-stripe-mcp`).
5. Set permissions:
   - **Customers**: Read & Write
   - **Subscriptions**: Read & Write
   - **Charges & PaymentIntents**: Read & Write (or Read-only for analytical agents)
   - **Payment Links & Checkout Sessions**: Read & Write
   - **Invoices**: Read & Write
6. Copy the generated key (`rk_test_...` or `rk_live_...`).

---

## 3. Stripe Austria & EU Verification Regulations (Meldezettel & Two-Person Rules)

When registering a live Stripe account for an Austrian business entity (GmbH, OG, KG, or Sole Proprietorship), you must comply with strict EU 5th Anti-Money Laundering (AML) and Austrian Know Your Customer (KYC) identity verification requirements:

### 3.1 Two-Person Verification Rule (Representative & UBO Verification)
Under EU/Austrian banking regulations, Stripe is required to identify and verify:
1. **Account Representative**: The individual opening and operating the Stripe account on behalf of the company.
2. **Ultimate Beneficial Owners (UBOs) & Co-Directors**: All natural persons directly or indirectly holding **more than 25% of company shares or voting rights**, or managing directors (*Geschäftsführer*) listed in the Austrian Commercial Register (*Firmenbuch*).

> **Important**: For standard corporate structures (such as an Austrian GmbH with two co-founders or co-directors), **both individuals must complete full identity and address verification** before Stripe will issue live production API keys or process bank payouts.

### 3.2 Proof of Home Address (Meldezettel & Meldebestätigung Rules)
- **Recency Limit**: Official address proof (*Meldezettel*, *Meldebestätigung*, bank statement, or utility bill) must be fresh (**strictly dated within the last 3 to 6 months**).
- **Two-Document Rule**: You **cannot** use the same document for photo ID and proof of address. If a Passport or Driver's License is uploaded as photo ID, a separate document (recent Meldezettel or bank statement) must be uploaded for home address proof.
- **Scan Requirements**: Documents must be full-color, high-resolution scans showing all 4 corners of the page without cropping or obstruction.

### 3.3 Business Entity Verification
- **Commercial Register Excerpt**: You must provide a recent *Firmenbuchauszug* or official trade registry document.
- **VAT Identification Number**: Provide your Austrian *UID / ATU* number (e.g. `ATU78901234`) issued by Finanzamt Österreich for B2B Reverse Charge tax processing.

---

## 4. Configuring Webhook Ingestion

To receive real-time updates for payments, subscription cancellations, or disputes:

1. In Stripe Dashboard, go to **Developers** > **Webhooks**.
2. Click **Add endpoint**.
3. Set the Endpoint URL to your public or local tunnel URL:
   `https://your-domain.com/api/webhooks/stripe` (or via Tailscale/ngrok pointing to port `11165`).
4. Select events:
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `charge.disputed`
   - `payment_intent.succeeded`
5. Reveal the **Signing secret** (`whsec_...`) and save it to `STRIPE_WEBHOOK_SECRET` in your `.env`.

---

## 5. Setting Up Austrian & EU Compliance

Ensure the following variables are present in `.env`:

```ini
DEFAULT_CURRENCY=EUR
DEFAULT_COUNTRY=AT
DEFAULT_VAT_RATE=0.20
ENABLE_EU_VAT_VALIDATION=true
```

This enforces:
- **Austrian 20% VAT** on domestic consumer invoices.
- **Reverse Charge** zero-rating when a valid EU VAT ID (e.g., `ATU12345678`) is supplied.
- **EPS / SEPA Direct Debit** as available payment methods on generated Stripe Checkout pages.

---

## 6. Webapp Onboarding Banner

When you launch `.\start.ps1`, open `http://127.0.0.1:11166`. If you are running in MOCK mode, a prominent **Onboarding Banner** appears below the Dashboard hero:

- Click **"Configure Stripe API Key"** to open Settings.
- Input your Restricted Key and click Save.
- The banner will automatically turn green ("Connected") and live Stripe data will replace the mock sample KPIs.
