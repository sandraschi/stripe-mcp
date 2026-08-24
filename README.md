<div align="center">

# 💳 stripe-mcp

### Stripe Gateway, SaaS Billing Ops & Austrian/EU Tax Compliance Engine

[![FastMCP 3.4](https://img.shields.io/badge/FastMCP-v3.4.4-635BFF.svg?style=for-the-badge&logo=python&logoColor=white)](https://github.com/jlowin/fastmcp)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-3776AB.svg?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Vite React](https://img.shields.io/badge/Vite_React-Port_11166-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](http://127.0.0.1:11166)
[![License MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-sub-documentation-map">Sub-Docs Map</a> •
  <a href="#-austrian--eu-compliance">Tax & Entity Rules</a>
</p>

---

</div>

`stripe-mcp` is a FastMCP 3.4+ server and SOTA React webapp dashboard designed to connect autonomous AI agents (Claude Desktop, Antigravity IDE, OpenManus) and human operators with Stripe payment processing, customer support operations, subscription management, and **Austrian/EU regional tax compliance (VAT 20%/10%/13%, EU ATU Reverse Charge, and BAO § 132 fiscal record retention)**.

---

## ⚡ Quick Start

```powershell
# Navigate to repository
cd D:\Dev\repos\stripe-mcp

# Install dependencies via uv
uv sync

# Launch Backend (Port 11165) & React Webapp (Port 11166)
.\start.ps1
```

Once launched, open **`http://127.0.0.1:11166`** to interact with the webapp dashboard.

---

## ✨ Key Features

- 💳 **Customer & Charge Operations**: Create customers, update metadata, fetch charges, and track disputes.
- 🔁 **Subscription Management**: Track active subscribers, pause, resume, cancel, and monitor MRR & churn KPIs.
- 🛍️ **3DS2 Checkout Generator**: Generate Stripe Payment Links & Checkout Sessions supporting **Cards**, **EPS Online Banking**, and **SEPA Direct Debit**.
- 🛡️ **Financial Safety Caps**: Strict hard limit (`MAX_REFUND_AMOUNT_EUR = €500.00`) blocking unauthorized agent refund overruns.
- 🇦🇹 **Austrian & EU Tax Compliance**:
  - Automatic **20% Standard VAT**, **10% / 13% Reduced Rates** (UStG 1994).
  - VIES/EU VAT ID syntax validation for **0% Reverse Charge** (`ATU\d{8}`).
  - **BAO § 132** 7-year fiscal invoice archive lock metadata.
- 🖥️ **SOTA React Webapp Dashboard (Port 11166)**: Catch-them-all UI with Dashboard, Customer Directory, Subscription Manager, Refund Studio, Invoice Studio, Webhook Inbox, Tools Workbench, Skills, LLM Chat, Settings, Help, and Audit Logs.
- ⚡ **Mock-until-Onboarded**: Works out of the box with synthetic Austrian data until your Stripe Restricted API Key (`rk_test_...`) is connected.

---

## 🇦🇹 Austrian & EU Legal Entity & Onboarding Rules

### 1. Do You Need a GmbH? (No!)
Stripe supports a wide range of legal entity types in Austria:
- **Einzelunternehmen (Individual / Sole Proprietorship)**: Freelancers (*Freiberufler*), solo developers, or unregistered sole traders. **Requires only 1 person for identity & address verification.**
- **Eingetragenes Einzelunternehmen (e.U.)**: Sole trader registered in Commercial Register (*Firmenbuch*).
- **GmbH / FlexCo / AG**: Incorporated companies. Requires *Firmenbuchauszug* and verification of all UBOs holding >25% shares.
- **OG / KG / Verein**: Partnerships or registered non-profit associations (*Verein* with ZVR number).

### 2. Single vs. Multi-Person Verification Rules
- **Einzelunternehmen**: 1 person needed (yourself). Passport/ID + Meldezettel / bank statement (< 3-6 months).
- **GmbH / Corporate**: Under EU 5th AML directives, Stripe requires identifying and verifying the Account Representative AND all **Ultimate Beneficial Owners (UBOs)** holding **>25% of company shares** or serving as co-directors (*Geschäftsführer*). For standard corporate entities (e.g. GmbH with 2 co-founders), **both individuals must submit identity & address verification**.

### 3. Proof of Address (Meldezettel / Meldebestätigung Rules)
- Must be fresh (**dated within 3 to 6 months**). Photo ID (passport) and proof of address (Meldezettel) must be separate documents. Full-color scans showing all 4 corners required.

---

## 🏗️ Architecture

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

## 🗺️ Sub-Documentation Map

| Area | Documentation Link | Description |
|---|---|---|
| 🖥️ **Webapp Dashboard** | [`webapp/README.md`](webapp/README.md) | React 18, Vite, TailwindCSS dashboard guide & setup. |
| 🐍 **Python Backend** | [`src/stripe_mcp/README.md`](src/stripe_mcp/README.md) | Core FastMCP server, tools, and tax engine reference. |
| 📚 **Master Docs Stack** | [`docs/README.md`](docs/README.md) | Index of onboarding, configuration, tools, and troubleshooting guides. |
| 📖 **System & Help Manual** | [`docs/HELP.md`](docs/HELP.md) | Full Stripe system manual, GmbH & entity guide, fleet map, and KYC rules. |
| 🚀 **Onboarding Runbook** | [`docs/ONBOARDING.md`](docs/ONBOARDING.md) | Step-by-step account registration, single vs multi-person UBO rules & Meldezettel verification. |
| ⚙️ **Configuration** | [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md) | Environment variables & financial safety cap settings. |
| 🛠️ **Tools Reference** | [`docs/TOOLS.md`](docs/TOOLS.md) | Complete parameter schemas & return types for all tools. |
| 📝 **MCPB Prompts** | [`assets/prompts/README.md`](assets/prompts/README.md) | MCPB 3-4-100 prompts metrics and validation. |
| 🧪 **Test Suite** | [`tests/README.md`](tests/README.md) | Pytest test suite & compliance assertions. |
| 🔧 **Scripts** | [`scripts/README.md`](scripts/README.md) | Maintenance & MCPB packaging scripts. |

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
