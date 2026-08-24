# User Guide & Operational Manual — stripe-mcp Payment Gateway & Austrian Tax Engine

Welcome to `stripe-mcp`, the enterprise FastMCP 3.4+ server and SOTA React webapp designed to connect autonomous AI agents and human operators with Stripe payment processing, customer billing operations, subscription analytics, and Austrian/EU tax compliance (VAT & BAO fiscal record keeping).

This guide provides comprehensive instructions, tutorials, tool references, workflow walkthroughs, environment configurations, and troubleshooting scenarios for getting the most out of `stripe-mcp`.

---

## CHAPTER 1: GETTING STARTED & ENVIRONMENT SETUP

### 1.1 Overview & System Capabilities
`stripe-mcp` provides a unified bridge between AI coding agents (such as Claude Desktop, Antigravity IDE, and OpenManus) and Stripe's billing ecosystem. It handles:
- Customer lifecycle management (creation, metadata updates, VAT ID assignment, address verification).
- SaaS subscription management (active subscriber tracking, pause, resume, upgrade, downgrade, cancellation).
- Payment processing & safety (charge inspection, payment intent lookup, policy-bounded refunds, dispute center alerts).
- Checkout link & invoice generation (Stripe Payment Links, Checkout Sessions, BAO-compliant PDF invoice schemas).
- Regional Austrian & EU compliance (20% standard VAT, 10%/13% reduced rates, EU ATU Reverse Charge validation, PSD2 3DS2 challenges, EPS & SEPA payment methods).
- Webhook event ingestion (`POST /api/webhooks/stripe`) routing transaction events directly into local event streams.
- SOTA React webapp dashboard running on port `11166` featuring catch-them-all pages and a mock-until-onboarded experience.

### 1.2 Installation Quick Start
To install `stripe-mcp` in your local environment (`D:\Dev\repos\stripe-mcp`):

```powershell
# Navigate to repository root
cd D:\Dev\repos\stripe-mcp

# Install Python dependencies using uv
uv sync

# Copy example environment configuration
Copy-Item .env.example .env

# Launch both Backend (port 11165) and Frontend Webapp (port 11166)
.\start.ps1
```

### 1.3 Operating Modes: MOCK vs LIVE/TEST
`stripe-mcp` supports two primary operating environments:

1. **Declared MOCK Mode (Default for evaluation)**:
   - Activated automatically when no Stripe API key is provided (`STRIPE_API_KEY=rk_test_mock...`).
   - Uses pre-populated synthetic Austrian customer records (*Sandra Mockinger*, *Joe Mocky GmbH*), synthetic subscriptions, MRR metrics, and sample invoices.
   - All tool calls execute safely without making network requests to Stripe servers.
   - A prominent red **Onboarding Banner** appears under the webapp hero encouraging you to connect live keys when ready.

2. **LIVE / TEST Mode**:
   - Activated when a valid Stripe Restricted Key (`rk_test_...` or `rk_live_...`) is supplied in `.env`.
   - Executes real API requests against Stripe's platform.
   - Respects safety caps (`MAX_REFUND_AMOUNT_EUR`) and read-only mode settings (`STRIPE_READ_ONLY=true`).

---

## CHAPTER 2: ENVIRONMENT CONFIGURATION DIRECTORY

All environment variables supported by `stripe-mcp` can be configured in `.env` or set in your environment prior to launching `start.ps1`:

| Environment Variable | Format / Type | Default Value | Purpose & Description |
|---|---|---|---|
| `PORT` | Integer | `11165` | Backend Starlette API server and FastMCP endpoint port (`/mcp`). |
| `WEB_PORT` | Integer | `11166` | Frontend Vite React webapp dashboard port. |
| `STRIPE_API_KEY` | String | `rk_test_mock...` | Stripe Restricted API Key (`rk_test_...` or `rk_live_...`). |
| `STRIPE_WEBHOOK_SECRET` | String | `whsec_mock...` | Webhook endpoint signing secret from Stripe Developers dashboard. |
| `STRIPE_MODE` | Enum (`test`, `live`) | `test` | Operating environment scope. |
| `STRIPE_READ_ONLY` | Boolean | `false` | When `true`, blocks all mutating actions (cancellations, refunds, updates). |
| `MAX_REFUND_AMOUNT_EUR` | Float | `500.00` | Safety cap limit for automated refund execution by agents. |
| `DEFAULT_CURRENCY` | String (ISO) | `EUR` | Default settlement currency code. |
| `DEFAULT_COUNTRY` | String (ISO) | `AT` | Default 2-letter country code (Austria). |
| `DEFAULT_VAT_RATE` | Float | `0.20` | Default standard VAT rate for Austria (20%). |
| `ENABLE_EU_VAT_VALIDATION` | Boolean | `true` | Enables syntax verification for EU/Austrian ATU VAT numbers. |

---

## CHAPTER 3: TOOL CATALOG & USAGE GUIDE

`stripe-mcp` groups API operations into high-efficiency portmanteau functions to minimize LLM context overhead:

### 3.1 `manage_stripe_customers`
Manage customer profiles and tax identifier records.

**Operations (`operation` parameter)**:
- `"list"`: Returns recent customer records.
- `"get"`: Retrieves a single customer profile by `customer_id`.
- `"create"`: Registers a new customer with `email`, `name`, `vat_id`, and `country`.
- `"update"`: Updates customer metadata or contact address.
- `"search"`: Queries customers matching an email or name substring.

**Example Agent Invocation**:
```json
{
  "operation": "create",
  "name": "Vienna AI Systems GmbH",
  "email": "billing@vienna-ai.at",
  "vat_id": "ATU77889900",
  "country": "AT"
}
```

### 3.2 `manage_stripe_subscriptions`
Manage recurring SaaS subscription plans.

**Operations (`operation` parameter)**:
- `"list"`: Lists active subscriptions. Optionally filter by `customer_id`.
- `"get"`: Retrieves subscription status, period end timestamp, and plan items.
- `"cancel"`: Cancels subscription plan at period end or immediately.
- `"pause"`: Temporarily pauses recurring billing cycle.
- `"resume"`: Resumes paused subscription billing.

**Example Agent Invocation**:
```json
{
  "operation": "cancel",
  "subscription_id": "sub_at_901"
}
```

### 3.3 `manage_stripe_payments`
Inspect charges, payment intents, issue bounded refunds, and audit disputes.

**Operations (`operation` parameter)**:
- `"list_charges"`: Retrieves transaction history and receipt download URLs.
- `"get_payment_intent"`: Fetches PaymentIntent status and 3DS2 challenge links.
- `"issue_refund"`: Issues a partial or full refund for a transaction `charge_id`. Evaluated against `MAX_REFUND_AMOUNT_EUR`.
- `"get_disputes"`: Lists active disputes and chargeback alerts.

**Example Agent Invocation**:
```json
{
  "operation": "issue_refund",
  "charge_id": "ch_at_501",
  "amount": 49.00,
  "reason": "requested_by_customer"
}
```

### 3.4 `manage_stripe_checkout`
Generate checkout links, Checkout Sessions, and BAO-compliant fiscal invoices.

**Operations (`operation` parameter)**:
- `"create_payment_link"`: Generates a persistent Stripe Payment Link URL.
- `"create_checkout_session"`: Creates an interactive 3DS2-ready Checkout Session with support for EPS, SEPA Direct Debit, and cards.
- `"create_invoice"`: Generates a fiscal invoice object with itemized Austrian VAT calculations.

**Example Agent Invocation**:
```json
{
  "operation": "create_checkout_session",
  "amount": 149.00,
  "currency": "EUR",
  "payment_method_types": ["card", "eps", "sepa_debit"],
  "customer_vat_id": "ATU12345678"
}
```

### 3.5 `stripe_revenue_analytics`
Query SaaS financial metrics and monthly tax collections.

**Metrics (`metric` parameter)**:
- `"mrr"`: Monthly Recurring Revenue.
- `"churn"`: Customer churn percentage.
- `"disputes"`: Dispute count and risk summary.
- `"vat_summary"`: Monthly Austrian VAT collected and B2B Reverse Charge sales total.
- `"all"`: Complete performance overview.

**Example Agent Invocation**:
```json
{
  "metric": "all"
}
```

### 3.6 `calculate_austrian_vat`
Calculate Austrian VAT amounts and verify ATU numbers for Reverse Charge eligibility.

**Parameters**: `amount`, `vat_type` (`standard_20`, `reduced_10`, `reduced_13`), `customer_vat_id`.

**Example Agent Invocation**:
```json
{
  "amount": 200.00,
  "vat_type": "standard_20",
  "customer_vat_id": "ATU12345678"
}
```

---

## CHAPTER 4: AUSTRIAN & EU COMPLIANCE REFERENCE

### 4.1 Austrian VAT (Umsatzsteuer) Structure
Under Austrian tax law (*Umsatzsteuergesetz 1994 - UStG*):
- **20% Standard Rate**: Default for digital software, AI SaaS platforms, cloud hosting, and consulting services.
- **10% Reduced Rate**: E-books, digital publications, newspapers, food items.
- **13% Reduced Rate**: Cultural events, concerts, hotel lodging, domestic travel.

### 4.2 EU Reverse Charge Mechanism
For B2B transactions where the buyer is a business registered in Austria or another EU member state:
- The customer provides their valid VAT number (`ATU...` for Austria, `DE...` for Germany).
- The tax rate is set to 0.0% (Reverse Charge).
- The invoice displays the statutory rationale: *"Steuerschuldnerschaft des Leistungsempfängers (Reverse Charge)"*.

### 4.3 BAO § 132 Fiscal Record Retention
Under the Austrian Federal Fiscal Code (*Bundesabgabenordnung* § 132):
- All accounting records, invoices, and transaction logs must be stored securely for **7 years** (10 years for EU OSS sales).
- Invoices must include seller UID (`ATU78901234`), sequential invoice ID, net amount, VAT breakdown, and gross total.

---

## CHAPTER 5: TUTORIALS & USER WORKFLOWS

### Tutorial 1: Customer Billing Support Workflow
1. User asks: *"Can you look up Sandra's account and issue a €49 refund for her last charge?"*
2. Search customer profile: `manage_stripe_customers(operation="search", email="sandra@vienna-tech.at")`.
3. Locate charge: `manage_stripe_payments(operation="list_charges")`.
4. Process refund: `manage_stripe_payments(operation="issue_refund", charge_id="ch_at_501", amount=49.00, reason="requested_by_customer")`.
5. Receive confirmation with refund ID and confirmation receipt link.

### Tutorial 2: Creating a Checkout Session with EPS & SEPA
1. User asks: *"Create a payment link for €199 net for an Austrian business with VAT ID ATU87654321."*
2. Validate VAT ID: `calculate_austrian_vat(amount=199.00, customer_vat_id="ATU87654321")`.
3. Result confirms Reverse Charge eligibility (€199.00 gross).
4. Create Checkout Session: `manage_stripe_checkout(operation="create_checkout_session", amount=199.00, payment_method_types=["card", "eps", "sepa_debit"], customer_vat_id="ATU87654321")`.
5. Return checkout link URL to user.

---

## CHAPTER 6: TROUBLESHOOTING & FAQ

### FAQ 1: Why does the webapp show "MOCK" badges?
- You are running in declared MOCK mode because no live Stripe API key was supplied in `.env`. Copy `.env.example` to `.env` and enter your `STRIPE_API_KEY`.

### FAQ 2: What happens if a refund exceeds €500?
- The server rejects the call with `SafetyCapExceeded`. Update `MAX_REFUND_AMOUNT_EUR` in `.env` if higher limits are desired.

### FAQ 3: How do I test webhooks locally?
- Launch `start.ps1` and point your Stripe CLI or webhook forwarder to `http://127.0.0.1:11165/api/webhooks/stripe`.

---

## CHAPTER 7: ADVANCED INTEGRATION EXAMPLES & API CODE SNIPPETS

### 7.1 Python SDK Integration Example
To invoke `stripe-mcp` programmatically within a custom Python script or FastAPI service:

```python
import httpx

async def call_mcp_checkout():
    async with httpx.AsyncClient() as client:
        payload = {
            "jsonrpc": "2.0",
            "method": "tools/call",
            "params": {
                "name": "manage_stripe_checkout",
                "arguments": {
                    "operation": "create_checkout_session",
                    "amount": 299.00,
                    "currency": "EUR",
                    "payment_method_types": ["card", "eps", "sepa_debit"],
                    "customer_vat_id": "ATU12345678"
                }
            },
            "id": 1
        }
        res = await client.post("http://127.0.0.1:11165/mcp", json=payload)
        print("MCP Checkout Response:", res.json())

# Run function
import asyncio
asyncio.run(call_mcp_checkout())
```

### 7.2 JavaScript / TypeScript Client Example
To invoke `stripe-mcp` from a Node.js script or webapp backend:

```typescript
import fetch from 'node-fetch';

async function fetchRevenueKPIs() {
    const response = await fetch('http://127.0.0.1:11165/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                name: 'stripe_revenue_analytics',
                arguments: { metric: 'all' }
            },
            id: 2
        })
    });
    const data = await response.json();
    console.log('Revenue Analytics:', JSON.stringify(data, null, 2));
}

fetchRevenueKPIs();
```

---

## CHAPTER 8: FULL TOOL PARAMETER SCHEMA DIRECTORY

### 8.1 Detailed Schema for `manage_stripe_customers`
```json
{
  "name": "manage_stripe_customers",
  "description": "Manage Stripe customer records (list, get, create, update, search)",
  "parameters": {
    "type": "object",
    "properties": {
      "operation": {
        "type": "string",
        "enum": ["list", "get", "create", "update", "search"],
        "description": "Customer operation enum"
      },
      "customer_id": {
        "type": "string",
        "description": "Stripe customer ID (cus_...)"
      },
      "email": {
        "type": "string",
        "description": "Customer email address"
      },
      "name": {
        "type": "string",
        "description": "Customer legal or business name"
      },
      "vat_id": {
        "type": "string",
        "description": "EU/Austrian VAT ID (e.g. ATU12345678)"
      },
      "country": {
        "type": "string",
        "description": "ISO 2-letter country code (default AT)"
      }
    },
    "required": ["operation"]
  }
}
```

### 8.2 Detailed Schema for `manage_stripe_subscriptions`
```json
{
  "name": "manage_stripe_subscriptions",
  "description": "Manage Stripe subscriptions (list, get, cancel, pause, resume)",
  "parameters": {
    "type": "object",
    "properties": {
      "operation": {
        "type": "string",
        "enum": ["list", "get", "cancel", "pause", "resume"],
        "description": "Subscription operation enum"
      },
      "subscription_id": {
        "type": "string",
        "description": "Stripe subscription ID (sub_...)"
      },
      "customer_id": {
        "type": "string",
        "description": "Filter subscriptions by customer ID"
      }
    },
    "required": ["operation"]
  }
}
```

### 8.3 Detailed Schema for `manage_stripe_payments`
```json
{
  "name": "manage_stripe_payments",
  "description": "Manage Stripe charges, payment intents, refunds, and disputes",
  "parameters": {
    "type": "object",
    "properties": {
      "operation": {
        "type": "string",
        "enum": ["list_charges", "get_payment_intent", "issue_refund", "get_disputes"],
        "description": "Payment operation enum"
      },
      "charge_id": {
        "type": "string",
        "description": "Stripe charge ID (ch_...)"
      },
      "payment_intent_id": {
        "type": "string",
        "description": "Stripe payment intent ID (pi_...)"
      },
      "amount": {
        "type": "number",
        "description": "Refund amount in EUR"
      },
      "reason": {
        "type": "string",
        "description": "Refund rationale"
      }
    },
    "required": ["operation"]
  }
}
```

### 8.4 Detailed Schema for `manage_stripe_checkout`
```json
{
  "name": "manage_stripe_checkout",
  "description": "Create Stripe Payment Links, Checkout Sessions, or Invoices",
  "parameters": {
    "type": "object",
    "properties": {
      "operation": {
        "type": "string",
        "enum": ["create_payment_link", "create_checkout_session", "create_invoice"],
        "description": "Checkout operation enum"
      },
      "amount": {
        "type": "number",
        "description": "Net amount in major currency units"
      },
      "currency": {
        "type": "string",
        "description": "Currency code (default EUR)"
      },
      "payment_method_types": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Allowed payment methods"
      },
      "customer_id": {
        "type": "string",
        "description": "Customer ID (cus_...)"
      },
      "customer_vat_id": {
        "type": "string",
        "description": "Customer EU VAT ID (ATU...)"
      },
      "vat_type": {
        "type": "string",
        "enum": ["standard_20", "reduced_10", "reduced_13"],
        "description": "Austrian VAT rate type"
      }
    },
    "required": ["operation", "amount"]
  }
}
```

---

## CHAPTER 9: AUDIT LOGGING & COMPLIANCE VERIFICATION

Every payment transaction and refund call executed by `stripe-mcp` is recorded in the local event audit queue:
- **Audit Data Points**: Timestamp, Tool Name, Executed Operation, Target Object ID, Net Amount, VAT Amount, Gross Amount, Safety Cap Verdict, Client IP.
- **Audit Access**: Viewable via the React webapp on `http://127.0.0.1:11166/logs` or via REST endpoint `GET /api/webhooks/recent`.

---

## CHAPTER 10: EXTENDED USE CASES & AGENTIC E-COMMERCE SCENARIOS

### 10.1 Automated Customer Churn Mitigation Agent
When a `customer.subscription.deleted` or `invoice.payment_failed` webhook event arrives:
1. The agent intercepts the event via `GET /api/webhooks/recent`.
2. The agent queries customer details via `manage_stripe_customers(operation="get", customer_id=...)`.
3. If payment failed due to card expiration, the agent generates a friendly email template with a secure billing update link.
4. If subscription was canceled, the agent records feedback in the local database and triggers a special discount offer checkout session via `manage_stripe_checkout(operation="create_payment_link", amount=29.00)`.

### 10.2 Agentic Negotiated Deal Settlement
In automated B2B sales workflows where an AI agent negotiates contract terms with a client:
1. The agent finalizes net price (e.g. €850.00 net).
2. The client provides company VAT ID `ATU65432109`.
3. The agent calls `calculate_austrian_vat(amount=850.00, customer_vat_id="ATU65432109")` to verify 0.0% Reverse Charge tax.
4. The agent issues a customized payment link: `manage_stripe_checkout(operation="create_payment_link", amount=850.00, customer_vat_id="ATU65432109")`.
5. The agent presents the payment link URL directly in the chat interface for instant closing.

### 10.3 Automated Monthly VAT Filing Assistant for Austrian Tax Advisors
At the end of each calendar month:
1. The tax advisor asks: *"Generate the Austrian USt-Voranmeldung (UVA) monthly revenue export."*
2. The agent calls `stripe_revenue_analytics(metric="vat_summary")`.
3. The agent compiles total 20% domestic VAT collected, 10% reduced VAT collected, and Reverse Charge B2B intra-EU turnover.
4. The agent maps data to official Austrian account codes (Account 4000, 4010, 4400, 3500) and exports a clean CSV file ready for BMD / RZL upload.

---

## CHAPTER 11: REACT WEBAPP DASHBOARD DEEP DIVE

The React webapp running on port `11166` is constructed using Vite, TailwindCSS dark mode, Framer Motion, Lucide icons, and Zustand state management:

### 11.1 Catch-Them-All Pages Architecture
1. **Dashboard (`/`)**:
   - Hero banner displaying system connectivity status and operating mode (`MOCK` vs `TEST/LIVE`).
   - Four primary KPI cards: Monthly Recurring Revenue (MRR), Active Subscriptions, Churn Rate, and Monthly Austrian VAT Collected.
   - Onboarding Cue: A prominent banner highlighting setup instructions if unconfigured.
   - Mock-until-onboarded badge clearing logic: Sample data automatically converts to live feed once API keys pass validation.

2. **Customer Ops (`/customers`)**:
   - Interactive table with full-text search across names, emails, and ATU numbers.
   - Detail drawer showing lifetime spend, active subscriptions, and address info.
   - Customer creation modal with integrated ATU syntax validator.

3. **Subscription Manager (`/subscriptions`)**:
   - Real-time subscriber directory.
   - Quick action triggers: Pause Billing, Resume Billing, Cancel Subscription.

4. **Payments & Refunds (`/payments`)**:
   - Charge history table showing payment methods (`Card`, `EPS`, `SEPA`), receipt links, and status pills.
   - One-click refund modal enforcing `MAX_REFUND_AMOUNT_EUR` guardrails.

5. **Invoices Studio (`/invoices`)**:
   - BAO § 132 compliant fiscal invoice builder.
   - Automatic 20%, 10%, 13% tax calculator and Reverse Charge zero-rating toggle.

6. **Checkout Generator (`/checkout`)**:
   - Interactive studio for creating Stripe Payment Links and Checkout Sessions.
   - Toggles for EPS, SEPA Direct Debit, and Klarna payment methods.

7. **Webhook Inbox (`/inbox`)**:
   - Live streaming feed of incoming webhook events (`POST /api/webhooks/stripe`).
   - JSON viewer for inspecting event payloads.

8. **Tools (`/tools`)**:
   - Interactive API workbench for executing FastMCP tools directly from the browser.

9. **Skills (`/skills`)**:
   - Catalog of agent prompt skills and operational recipes.

10. **Chat (`/chat`)**:
    - Embedded conversational interface connecting to local or remote LLM providers via Zustand store (`store/llm.ts`).

11. **Settings (`/settings`)**:
    - Configure Stripe API keys, webhook secrets, default currency, safety caps, and local LLM providers.

12. **Help (`/help`)**:
    - Embedded user guide, API references, and Austrian tax law cheatsheets.

13. **Logs (`/logs`)**:
    - Real-time backend system and audit logs viewer.

---

## CHAPTER 12: GLOSSARY OF AUSTRIAN & EU FINANCIAL TERMS

- **Anzahlung**: Advance payment or deposit on an invoice.
- **ATU Number**: Austrian Value Added Tax Identification Number (*Umsatzsteuer-Identifikationsnummer*).
- **BAO**: *Bundesabgabenordnung* — Austrian Federal Fiscal Code regulating tax records and accounting retention.
- **BMD**: Popular accounting software suite used by tax advisors in Austria.
- **Bruttobetrag**: Gross total amount including VAT.
- **EPS**: *Electronic Payment Standard* — Online banking transfer method widely used in Austria.
- **Nettobetrag**: Net amount before tax.
- **Reverse Charge**: Procedure shifting VAT payment obligation to the recipient business in B2B EU transactions.
- **RZL**: Austrian tax accounting software package.
- **SEPA**: *Single Euro Payments Area* for Euro bank transfers.
- **Steuernummer**: Austrian local tax registration number issued by the Finanzamt.
- **USt-Voranmeldung (UVA)**: Monthly or quarterly advance VAT return submitted to Finanzamt Österreich.
- **UStG 1994**: *Umsatzsteuergesetz 1994* — Austrian VAT Act.

---

## CHAPTER 13: COMPREHENSIVE END-TO-END TUTORIAL MANUAL

### 13.1 Tutorial A: Building an Autonomous SaaS Subscription Agent
In this step-by-step tutorial, you will configure an AI agent to automatically manage SaaS subscriptions for an Austrian software company:

1. **Step 1: Environment Setup**
   - Create `.env` in `D:\Dev\repos\stripe-mcp`.
   - Set `STRIPE_MODE=test` and `MAX_REFUND_AMOUNT_EUR=250.00`.
   - Start the service using `.\start.ps1`.

2. **Step 2: Customer Registration & Tax Check**
   - Execute `manage_stripe_customers(operation="create", email="ceo@graz-robotics.at", name="Graz Robotics GmbH", vat_id="ATU55443322", country="AT")`.
   - Verify that ATU syntax validation confirms `reverse_charge_eligible = True`.

3. **Step 3: Creating Recurring Plan**
   - Execute `manage_stripe_checkout(operation="create_checkout_session", amount=499.00, customer_vat_id="ATU55443322", payment_method_types=["card", "eps", "sepa_debit"])`.
   - Send returned URL `https://checkout.stripe.com/...` to customer.

4. **Step 4: Audit & Verification**
   - Confirm subscription active status via `manage_stripe_subscriptions(operation="list")`.
   - Verify that MRR metrics update on the React dashboard on port `11166`.

---

## CHAPTER 14: ADVANCED SECURITY AUDITING & RESTRICTED KEY DEPLOYMENT

### 14.1 Principle of Least Privilege for Stripe Keys
To ensure complete protection against key exposure or unauthorized account access:
- Never use root secret keys (`sk_live_...`).
- Always generate a **Restricted API Key** in the Stripe Dashboard.
- Restrict key permissions to only required endpoints:
  - Customers: Read & Write
  - Subscriptions: Read & Write
  - PaymentIntents & Charges: Read & Write
  - Payment Links: Read & Write
  - Webhook Endpoints: Read-only

---

## CHAPTER 15: COMPLETE SYSTEM INTEGRATION ARCHITECTURE

```text
+-----------------------------------------------------------------------+
|                             AI AGENT HOST                             |
|          (Claude Desktop / Antigravity IDE / OpenManus / Cursor)      |
+-----------------------------------------------------------------------+
                                   |
                         (FastMCP stdio / HTTP /mcp)
                                   v
+-----------------------------------------------------------------------+
|                    stripe-mcp FastMCP 3.4+ SERVER                     |
|                           (Port 11165 REST/MCP)                       |
|                                                                       |
|  +------------------------+  +-------------------------------------+  |
|  |  austria_tax.py Engine |  |  Portmanteau Tools                  |  |
|  |  - 20%/10%/13% VAT       |  |  - manage_stripe_customers          |  |
|  |  - ATU Syntax Checker  |  |  - manage_stripe_subscriptions      |  |
|  |  - Reverse Charge      |  |  - manage_stripe_payments         |  |
|  |  - BAO § 132 Metadata  |  |  - manage_stripe_checkout         |  |
|  +------------------------+  +-------------------------------------+  |
+-----------------------------------------------------------------------+
            |                                           |
    (Stripe REST API)                           (SSE & REST /api)
            v                                           v
+-----------------------+               +-------------------------------+
|  Stripe Cloud Platform|               | React + Vite Webapp Dashboard |
|  - API Gateway        |               |          (Port 11166)         |
|  - Webhooks Ingest    |               | - Hero & KPIs (MRR/VAT)       |
|  - EPS / SEPA / PSD2  |               | - Mock-until-onboarded        |
+-----------------------+               | - Catch-them-all Pages        |
                                        +-------------------------------+
```

---

## CHAPTER 16: ADVANCED TROUBLESHOOTING MATRIX & DIAGNOSTICS

### 16.1 Error Resolution Decision Tree
When experiencing unexpected behavior during API calls or agent interactions, consult the following diagnostic matrix:

| Error Symptom | Probable Root Cause | Resolution & Corrective Steps |
|---|---|---|
| `Invalid ATU Format` | User supplied incorrect length or missing prefix | Verify VAT ID starts with `ATU` followed by 8 digits (e.g. `ATU12345678`). |
| `SafetyCapExceeded` | Refund request exceeds `MAX_REFUND_AMOUNT_EUR` limit | Either lower refund request amount or increase limit in `.env`. |
| `STRIPE_READ_ONLY` | Mutation attempted while read-only mode is active | Set `STRIPE_READ_ONLY=false` in `.env` if write actions are intended. |
| `ConnectionRefused 11165` | Backend server process failed to start or crashed | Run `.\start.ps1` to clear zombie ports and inspect `debug.log`. |
| `CORS Error 11166` | Cross-origin request blocked by browser | Ensure webapp origin `http://127.0.0.1:11166` is listed in `server.py` CORS middleware. |

---

## CHAPTER 17: AUSTRIAN TAX ADVISOR (STEUERBERATER) EXPORT FORMATS

### 17.1 Standard CSV Export Specification for BMD / RZL
When exporting transaction data for monthly tax filings (*USt-Voranmeldung*):
- **Header Columns**: `Belegnummer`, `Belegdatum`, `Konto`, `Gegenkonto`, `Nettobetrag_EUR`, `Steuersatz`, `USt_Betrag_EUR`, `Bruttobetrag_EUR`, `UID_Kunde`, `Buchungstext`.
- **Sample Record**:
  `INV-2026-001;2026-08-24;2700;4000;100.00;20;20.00;120.00;ATU12345678;SaaS Subscription Sandra Mockinger`

---

## CHAPTER 18: SYSTEM AUDIT CHECKLIST FOR PRODUCTION DEPLOYMENT

Before deploying `stripe-mcp` into a live agentic workflow:
1. Verify `STRIPE_API_KEY` is a Restricted Key (`rk_live_...`) with limited permissions.
2. Confirm `STRIPE_MODE=live` is explicitly acknowledged.
3. Confirm `MAX_REFUND_AMOUNT_EUR` is configured to an acceptable organizational threshold.
4. Test webhook signature verification using Stripe CLI (`stripe trigger invoice.payment_failed`).
5. Ensure `start.ps1` starts cleanly and all tests pass (`just ci`).

---

## CHAPTER 19: DETAILED FIELD DICTIONARY & DATA TYPES

To assist software engineers integrating custom client applications or AI agents with `stripe-mcp`, this chapter documents exact data types, constraints, and validation rules across all models:

### 19.1 Customer Data Model (`CustomerRecord`)
- `id` (String, Required): Format `cus_[a-zA-Z0-9]+`. Unique customer identifier.
- `name` (String, Required): Full legal name or registered corporate name.
- `email` (String, Required): Valid RFC 5322 email string.
- `country` (String, Optional): 2-letter ISO 3166-1 alpha-2 country code (default `"AT"`).
- `vat_id` (String, Optional): Must match `ATU\d{8}` for Austria or equivalent EU VAT regex pattern.
- `created_at` (String/Integer, Read-Only): Unix timestamp of creation date.
- `livemode` (Boolean, Read-Only): Indicates environment mode.

### 19.2 Invoice Data Model (`InvoiceRecord`)
- `id` (String, Required): Format `in_[a-zA-Z0-9]+`.
- `customer_id` (String, Required): Associated `cus_...` ID.
- `subtotal` (Float, Required): Net amount in EUR before tax calculation.
- `vat_rate` (Float, Required): Applicable tax percentage (`0.20`, `0.10`, `0.13`, `0.0`).
- `vat_amount` (Float, Required): Rounded tax value in EUR.
- `total` (Float, Required): Net + VAT gross total in EUR.
- `seller_uid` (String, Read-Only): Default seller VAT ID (`"ATU78901234"`).
- `bao_retention_years` (Integer, Constant): Statutory value `7`.

---

## CHAPTER 20: EXHAUSTIVE TESTING & QUALITY ASSURANCE MANUAL

To maintain `assfix-zero` quality standards, `stripe-mcp` includes automated tests for all backend python modules and frontend React components.

### 20.1 Executing Python Backend Test Suite
```powershell
# Run full pytest suite with verbose output
uv run pytest -v

# Run Austrian tax calculation tests only
uv run pytest tests/test_austria_tax.py
```

### 20.2 Executing Frontend Webapp Type Checks & Build Verification
```powershell
# Navigate to webapp directory
cd webapp

# Run TypeScript strict type-check
npx tsc --noEmit

# Run Vite production build
bun run build
```

### 20.3 Executing Unified Local CI Pipeline
```powershell
# Run complete CI suite (ruff + tsc + pytest)
just ci
```

---

## CHAPTER 21: AUSTRIAN TAX ORDINANCE CITATIONS & STATUTORY ANALYSIS

This chapter provides extended statutory context regarding Austrian tax legislation as applied to automated software systems:

### 21.1 Federal Fiscal Code (§ 132 Bundesabgabenordnung)
Paragraph 132 of the BAO governs the retention of books, records, documents, receipts, and computer-stored accounting data. Software systems issuing financial receipts in Austria must guarantee:
- Retention period of 7 years, calculated from the end of the calendar year in which the entry was made.
- Readability and data integrity across the entire statutory retention window.
- In `stripe-mcp`, all generated invoice objects record a timestamp and BAO retention flag ensuring compliance.

### 21.2 Value Added Tax Act (§ 11 & § 19 Umsatzsteuergesetz 1994)
- **§ 11 UStG (Rechnungslegung)**: Mandates the inclusion of statutory fields on all invoices exceeding €400 gross, including seller UID, buyer UID (if B2B), sequential invoice number, net amount, tax rate, and tax amount.
- **§ 19 UStG (Steuerschuldner)**: Regulates the Reverse Charge mechanism for intra-EU B2B transactions. When an Austrian customer supplies an ATU number or cross-border EU business number, tax liability transfers to the buyer.

---

## CHAPTER 22: DISPUTE & CHARGEBACK HANDLING PROTOCOL

When a credit card dispute or chargeback is initiated against a transaction:
1. Stripe emits a `charge.disputed` event to `POST /api/webhooks/stripe`.
2. `stripe-mcp` logs the dispute in the webapp Inbox tab.
3. The AI agent can query active disputes using `manage_stripe_payments(operation="get_disputes")`.
4. The agent compiles evidence (customer email address, transaction timestamp, receipt link, and service access log).
5. The evidence bundle is rendered in the webapp for human operator submission to Stripe.

---

## CHAPTER 23: EXTENDED AGENT OPERATIONAL SCENARIOS

### 23.1 Scenario: Bulk Austrian B2B Annual Renewal Invoicing
1. Agent queries all active subscriptions using `manage_stripe_subscriptions(operation="list")`.
2. Agent filters subscribers located in Austria (`country="AT"`).
3. For each subscriber with a valid ATU VAT ID, agent generates a zero-rated Reverse Charge invoice using `manage_stripe_checkout(operation="create_invoice", amount=..., customer_vat_id=...)`.
4. Agent sends invoice summary notifications to account managers.

---

## CHAPTER 24: SUMMARY & BEST PRACTICES CHECKLIST

- Always operate in `STRIPE_MODE=test` during development.
- Always use Restricted Keys (`rk_test_...`) rather than root secret keys.
- Enforce `MAX_REFUND_AMOUNT_EUR` safety caps for automated agent refund tools.
- Verify ATU syntax for Austrian corporate accounts before applying Reverse Charge zero-rating.
- Archive invoice metadata for 7 years per § 132 BAO standards.

---

## CHAPTER 25: COMPLETE STRIPE WEBHOOK EVENT TAXONOMY

For thorough event handling, `stripe-mcp` categorizes incoming Stripe webhook payloads into five distinct domain categories:

1. **Customer Domain Events**:
   - `customer.created`: Logged when a new customer profile is registered.
   - `customer.updated`: Triggers when billing address or tax IDs update.
   - `customer.deleted`: Clears cached customer records.

2. **Subscription Domain Events**:
   - `customer.subscription.created`: Initial plan purchase.
   - `customer.subscription.updated`: Tier upgrade or status shift.
   - `customer.subscription.deleted`: Churn event requiring support follow-up.

3. **Payment & Charge Events**:
   - `payment_intent.succeeded`: Successful payment capture.
   - `payment_intent.payment_failed`: Failed payment requiring dunning email.
   - `charge.refunded`: Refund issuance confirmation.
   - `charge.disputed`: Chargeback opened by issuing bank.

4. **Invoice Events**:
   - `invoice.created`: Draft invoice generated.
   - `invoice.paid`: Receipt issued and BAO retention record saved.
   - `invoice.payment_failed`: Payment declined notice.

5. **Checkout Events**:
   - `checkout.session.completed`: User completed payment link checkout.

---

## CHAPTER 26: PRODUCTION DEPLOYMENT & TAILSCALE FUNNEL RUNBOOK

To expose your `stripe-mcp` webhooks safely to the public internet while keeping your local machine secure:

1. **Step 1: Start Server**
   ```powershell
   .\start.ps1
   ```

2. **Step 2: Start Webhook Listener / Tunnel**
   Use Tailscale Funnel or ngrok to route public webhooks to local port 11165:
   ```powershell
   tailscale funnel 11165
   ```

3. **Step 3: Register Endpoint in Stripe Dashboard**
   Point your Stripe Webhook endpoint to:
   `https://your-tailscale-node.ts.net/api/webhooks/stripe`

4. **Step 4: Verify Signature Verification**
   Set `STRIPE_WEBHOOK_SECRET=whsec_...` in `.env`. All incoming payloads will now be cryptographically authenticated.

---

## CHAPTER 27: COMPREHENSIVE OPERATIONS LOG & MAINTENANCE SCHEDULE

To maintain operational health and compliance over extended deployments:
- **Daily**: Monitor Webhook Inbox on `http://127.0.0.1:11166/inbox` for failed payment events. Inspect log entries for authorization errors or rate-limit warnings.
- **Weekly**: Review active dispute notifications and audit safety cap logs. Verify that no unauthorized refund requests bypassed agent approval limits.
- **Monthly**: Export revenue and VAT totals for USt-Voranmeldung submission. Generate PDF statement reports for internal financial accounting review.
- **Quarterly**: Run `just ci` and update dependencies using `uv sync`. Perform security vulnerability scans across Python and Node package trees.
- **Annually**: Verify 7-year BAO § 132 archive integrity and clean temporary logs. Backup persistent event database files to secondary storage locations.

For additional help, visit the React webapp Help tab on port `11166` or consult `docs/TROUBLESHOOTING.md`.
