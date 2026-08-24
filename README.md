# stripe-mcp

> FastMCP 3.4+ Server & SOTA React Webapp for Stripe Payment Operations, Billing Support, Subscription Analytics, and Austrian/EU Tax Compliance (VAT & BAO).

[![FastMCP 3.4](https://img.shields.io/badge/FastMCP-3.4.4-blue.svg)](https://github.com/jlowin/fastmcp)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-green.svg)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

`stripe-mcp` connects autonomous AI agents and humans with Stripe's payment gateway. It offers full customer lifecycle management, subscription controls, payment intent creation, refund processing with financial safety caps, revenue analytics, and built-in compliance for **Austrian VAT (20%, 10%, 13%)**, **EU Reverse Charge (ATU VAT ID verification)**, **PSD2 Strong Customer Authentication (3D Secure 2)**, and **BAO 7-year invoice retention schema**.

## Features

- 💳 **Payment & Customer Ops**: Create customers, update metadata, fetch charges, issue policy-bounded refunds, and track disputes.
- 🔁 **Subscription Management**: Query active subscriptions, pause/resume, cancel, and calculate MRR & churn metrics.
- 🛍️ **Checkout Link Generator**: Programmatically create Stripe Payment Links & Checkout Sessions with native support for EPS (*Electronic Payment Standard*), SEPA Direct Debit, and Klarna.
- 🇦🇹 **Austrian & EU Tax Compliance**:
  - Automatic Austrian VAT calculation (20% standard, 10%/13% reduced rates).
  - VIES/EU VAT ATU syntax verification for Reverse Charge.
  - BAO (§ 132) fiscal invoice schema metadata generation.
- 🔔 **Real-Time Webhook Engine**: Listened endpoint (`POST /api/webhooks/stripe`) routing `invoice.payment_failed`, `customer.subscription.deleted`, and `charge.disputed` to fleet event streams.
- 🖥️ **SOTA React Webapp (Port 11166)**: Catch-them-all UI with Dashboard, Customer Ops, Invoice Studio, Payment Link Studio, Inbox, Tools, Skills, Chat, Settings, Help, and Logs.
- ⚡ **Mock-until-Onboarded**: Works out of the box with declared mock data until your actual Stripe Restricted API Key is supplied.

## Austrian & EU Regulations & Onboarding Requirements

When deploying `stripe-mcp` in Austria or the EU, the platform enforces compliance with regional financial laws and Know Your Customer (KYC) directives:

### 1. Account Onboarding & Meldezettel Verification Rules
- **Two-Person Verification Rule (Representative & UBOs)**: Under EU 5th AML directives, Stripe requires identifying and verifying the Account Representative AND all Ultimate Beneficial Owners (UBOs) holding **>25% of company shares** or serving as co-directors (*Geschäftsführer*). For standard corporate entities (e.g. GmbH with 2 co-founders), **both individuals must submit identity & address verification**.
- **Proof of Address (Meldezettel / Meldebestätigung)**: Must be fresh (**strictly dated within 3 to 6 months**). Photo ID (passport) and proof of address (Meldezettel) must be separate documents.

### 2. Austrian Tax Act (UStG 1994) & Reverse Charge
- **20% Standard Rate**: Default for digital software, SaaS platforms, and consulting.
- **10% & 13% Reduced Rates**: E-books, news publications, lodging, and cultural events.
- **0% Reverse Charge**: Applied to B2B EU purchases upon verification of a valid Austrian UID / ATU number (`ATU\d{8}`).

### 3. Federal Fiscal Code (BAO § 132)
- All issued fiscal PDF invoices record an immutable 7-year statutory archive lock flag required under Austrian tax law.

## Quick Start

```powershell
# Clone or navigate to repo
cd D:\Dev\repos\stripe-mcp

# Install dependencies
uv sync

# Launch both Backend (11165) and Webapp (11166)
.\start.ps1
```

## How It Runs

`stripe-mcp` runs headless by default as an MCP stdio/HTTP server, while providing an optional interactive webapp dashboard on `http://127.0.0.1:11166`.

- **Hands-In**: Interact directly with the React webapp to inspect revenue KPIs, generate payment links, and view webhook feeds.
- **Hands-Out**: Allow AI agents (Claude Desktop, Antigravity, OpenManus) to autonomously manage billing, run customer queries, and verify tax compliance.

## Environment Variables

Copy `.env.example` to `.env`:

```ini
PORT=11165
WEB_PORT=11166
STRIPE_API_KEY=rk_test_your_restricted_key
STRIPE_MODE=test
DEFAULT_CURRENCY=EUR
DEFAULT_COUNTRY=AT
DEFAULT_VAT_RATE=0.20
MAX_REFUND_AMOUNT_EUR=500.00
```

## License

MIT License. See [LICENSE](LICENSE) for details.
