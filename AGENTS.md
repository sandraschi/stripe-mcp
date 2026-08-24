# AGENTS.md — Local Instructions for stripe-mcp

**Repo Role:** FastMCP 3.4+ server & SOTA React webapp for Stripe payment operations, billing support, subscription analytics, and Austrian/EU tax compliance (VAT & BAO).

## Quick Reference

- **Parent Standard:** `D:\Dev\repos\mcp-central-docs\standards\AGENTS.md`
- **Backend Port:** `11165` (`REST /api`, `FastMCP /mcp`, `Webhooks`)
- **Frontend Port:** `11166` (`Vite React webapp`)
- **Python runner:** `C:\Users\sandr\.local\bin\uv.exe run python`
- **Start command:** `.\start.ps1` or `start.bat`

## Key Architecture

- `src/stripe_mcp/server.py`: FastMCP 3.4+ server entrypoint & uvicorn ASGI app
- `src/stripe_mcp/config.py`: Environment settings (Stripe credentials, mode, tax defaults)
- `src/stripe_mcp/austria_tax.py`: Austrian VAT calculation (20%, 10%, 13%), EU ATU VAT verification, and BAO invoice retention compliance
- `src/stripe_mcp/tools/`: Portmanteau tools for Customers, Subscriptions, Payments, Checkout, Analytics, and Prefab UI cards
- `webapp/`: React + Vite + Tailwind dark mode dashboard with catch-them-all pages, mock-until-onboarded state, and LLM store

## Build & Test

```powershell
uv sync
uv run pytest
just ci
```
