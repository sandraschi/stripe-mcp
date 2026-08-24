# Automated Test Suite (`tests`)

Automated pytest unit and integration tests for `stripe-mcp`.

## Test Modules

- `test_austria_tax.py`: Verifies Austrian 20%/10%/13% VAT calculations, ATU VAT ID regex syntax validation (`ATU\d{8}`), and Reverse Charge zero-rating logic.
- `test_server.py`: Verifies Starlette REST API endpoints (`/api/health`, `/api/webhooks/recent`, `/api/webhooks/stripe`).

## Running Tests

```powershell
# Run all tests using pytest
uv run pytest

# Run tests with verbose output
uv run pytest -v
```
