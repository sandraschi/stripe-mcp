# stripe-mcp Documentation Index

Welcome to the `stripe-mcp` documentation stack.

## Guides & References

- [HELP.md](HELP.md): Complete system overview, Stripe architecture, fleet integration map, safety guardrails, paying vs receiving payments, and **Austrian/EU Meldezettel & Two-Person onboarding regulations**.
- [ONBOARDING.md](ONBOARDING.md): First-time account onboarding, Restricted Keys, Webhook configuration, and Austrian KYC/UBO verification rules.
- [CONFIGURATION.md](CONFIGURATION.md): Complete list of environment variables, mode toggles, and financial safety caps (`MAX_REFUND_AMOUNT_EUR`).
- [DEVELOPMENT.md](DEVELOPMENT.md): Local development workflow, architecture overview, testing, and building.
- [TOOLS.md](TOOLS.md): Detailed reference of all FastMCP tools, parameters, returns, and Prefab UI cards.
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md): Solutions for common Stripe API errors, webhook signature verification failures, and tax validation issues.

## Regional Compliance Summary
- **Austrian VAT (UStG 1994)**: 20% Standard, 10% & 13% Reduced Rates.
- **EU Reverse Charge (UStG § 19)**: 0% B2B zero-rating with ATU VAT ID validation (`ATU\d{8}`).
- **BAO (§ 132)**: 7-Year fiscal record lock for invoice schemas.
- **Stripe KYC**: Two-person UBO/Representative verification rule & fresh Meldezettel (<3-6 months) requirements.
