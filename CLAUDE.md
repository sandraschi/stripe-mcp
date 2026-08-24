# CLAUDE.md — stripe-mcp

FastMCP server and webapp providing Stripe payment tools, billing operations, and Austrian/EU tax compliance.

## Environment & Run Commands

- **Python**: `C:\Users\sandr\.local\bin\uv.exe run python`
- **Run server**: `uv run python -m stripe_mcp.server`
- **Run tests**: `uv run pytest`
- **Lint**: `uv run ruff check .`
- **Format**: `uv run ruff format .`
- **Webapp dev**: `cd webapp && bun run dev`
- **Start script**: `.\start.ps1` (Backend on 11165, Frontend on 11166)

## FastMCP Conventions

- Uses FastMCP `>=3.4.4`
- Group tools into portmanteau functions (`manage_stripe_customers`, `manage_stripe_subscriptions`, `manage_stripe_payments`, `manage_stripe_checkout`, `stripe_revenue_analytics`, `calculate_austrian_vat`)
- Provide Prefab UI `@mcp.tool(app=True)` cards for subscription and revenue dashboards
- Default mode is `test` with MOCK fallback when API keys are unconfigured
