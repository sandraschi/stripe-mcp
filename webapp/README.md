# stripe-mcp Webapp Dashboard (Port 11166)

The `stripe-mcp` webapp is a state-of-the-art (SOTA) dark-theme dashboard built with **Vite**, **React 18**, **TailwindCSS**, **Lucide Icons**, and **Zustand**. It provides interactive billing management, payment link generation, invoice studio, real-time webhook feeds, and Austrian/EU tax compliance reference tools.

## Feature Overview

- 📊 **Dashboard (`/`)**: Real-time revenue KPIs (MRR, Subscriber Count, Churn Rate, Austrian 20% VAT Collected) and Mock Mode Onboarding Banner.
- 👥 **Customer Directory (`/customers`)**: Customer table with search and ATU VAT ID validator.
- 🔁 **Subscriptions (`/subscriptions`)**: Active plan directory with pause, resume, and cancellation triggers.
- 💳 **Payments (`/payments`)**: Charge history and policy-bounded refund modal enforcing `MAX_REFUND_AMOUNT_EUR` limit.
- 📄 **Invoices Studio (`/invoices`)**: BAO § 132 fiscal PDF invoice builder with itemized tax breakdown and Reverse Charge zero-rating.
- 🔗 **Checkout Studio (`/checkout`)**: Interactive 3DS2 Payment Link generator for Cards, EPS Online Banking, and SEPA Direct Debit.
- 📥 **Webhook Inbox (`/inbox`)**: Live streaming payload feed (`POST /api/webhooks/stripe`).
- 🛠️ **API Tools (`/tools`)**: Browser-based workbench for executing FastMCP tools.
- ⚡ **Skills (`/skills`)**: Agent operational recipes.
- 💬 **LLM Chat (`/chat`)**: Embedded assistant chat connected via Zustand store (`store/llm.ts`).
- ⚙️ **Settings (`/settings`)**: Configure Restricted API keys, webhook secrets, default currency, and safety limits.
- ❓ **Help & Docs (`/help`)**: Comprehensive user manual, Stripe overview, fleet integration map, and Austrian/EU regulations.
- 📜 **Audit Logs (`/logs`)**: Immutable system audit log viewer.

## Austrian & EU Regulatory Summary

- **Stripe KYC Onboarding**:
  - **Two-Person Verification Rule**: Under EU 5th AML Directive, both the Account Representative and Ultimate Beneficial Owners (UBOs) / co-directors holding **>25% equity** must submit identity & address proof.
  - **Proof of Address (Meldezettel / Meldebestätigung)**: Must be fresh (**strictly dated within 3 to 6 months**). Separate documents required for photo ID vs proof of address.
- **Austrian Tax Compliance**:
  - UStG 1994 VAT Rates: 20% Standard, 10% & 13% Reduced Rates.
  - EU Reverse Charge: 0% B2B zero-rating with ATU VAT ID validation (`ATU\d{8}`).
  - BAO § 132: 7-Year statutory record retention lock.

## Development & Build Commands

```powershell
# Navigate to webapp directory
cd webapp

# Install dependencies
npm install

# Run dev server on port 11166
npm run dev

# Run TypeScript typecheck and production build
npx tsc --noEmit && npm run build
```
