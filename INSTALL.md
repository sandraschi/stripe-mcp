# Installation Guide — `stripe-mcp`

Follow this guide to install, configure, and register `stripe-mcp` with your AI coding agent or Claude Desktop.

For first-time account setup, see [docs/ONBOARDING.md](docs/ONBOARDING.md).

---

## Prerequisites

- **Python**: 3.11+
- **uv**: Installed (`uv --version`)
- **bun / Node.js**: Installed for webapp UI
- **Stripe Account**: Optional for initial evaluation (uses built-in MOCK mode if unconfigured). For live/test Stripe access, obtain a **Restricted API Key** (`rk_test_...` or `rk_live_...`).

---

## Installation Steps

### 1. Install Dependencies

```powershell
cd D:\Dev\repos\stripe-mcp
uv sync
```

### 2. Configure Environment

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Edit `.env` to supply your credentials:

```ini
STRIPE_API_KEY=rk_test_your_key_here
STRIPE_MODE=test
DEFAULT_CURRENCY=EUR
```

### 3. Verify Setup

Run unit tests and linters:

```powershell
uv run pytest
uv run ruff check .
```

---

## Registration in Claude Desktop

Add `stripe-mcp` to your `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "C:\\Users\\sandr\\.local\\bin\\uv.exe",
      "args": [
        "--directory",
        "D:\\Dev\\repos\\stripe-mcp",
        "run",
        "python",
        "-m",
        "stripe_mcp.server"
      ],
      "env": {
        "STRIPE_API_KEY": "rk_test_your_key_here",
        "STRIPE_MODE": "test",
        "DEFAULT_CURRENCY": "EUR"
      }
    }
  }
}
```

---

## Running the Webapp & API

Double click `start.bat` or run:

```powershell
.\start.ps1
```

- **API & MCP endpoint**: `http://127.0.0.1:11165`
- **Dashboard Webapp**: `http://127.0.0.1:11166`
