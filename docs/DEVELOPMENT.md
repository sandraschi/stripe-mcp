# Development Guide — `stripe-mcp`

## Workspace Setup

- Python: `3.11+`
- Package manager: `uv`
- Frontend package manager: `bun`

```powershell
# Clone & install
cd D:\Dev\repos\stripe-mcp
uv sync
cd webapp && bun install && cd ..
```

## Running Local Environment

Start both Backend and Frontend with hot reload:

```powershell
.\start.ps1
```

Or run backend directly:

```powershell
uv run python -m stripe_mcp.server
```

## Running Tests & Linters

```powershell
# Python unit tests
uv run pytest

# Python linter & formatter check
uv run ruff check .
uv run ruff format --check .

# Frontend type check & build
cd webapp
bun run build
npx tsc --noEmit

# Complete local CI check
just ci
```

## Onboarding Requirement

Onboarding is mandatory whenever live Stripe keys are attached. In mock mode, declared sample data is displayed with `MOCK` badges.
