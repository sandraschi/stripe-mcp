# Maintenance & Utility Scripts (`scripts`)

Utility scripts for packaging, staging, and maintaining `stripe-mcp`.

## Scripts Index

### `mcpb_pack.py`
- **Purpose**: Verifies prompt word counts (`system.md` ≥ 3,000 words, `user.md` ≥ 4,000 words, `examples.json` ≥ 100 objects) and stages source code into the `mcpb/` distribution folder.
- **Usage**:
  ```powershell
  uv run python scripts/mcpb_pack.py
  ```
