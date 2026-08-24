# justfile for stripe-mcp

default:
    @just --list

serve:
    uv run python -m stripe_mcp.server

test:
    uv run pytest

lint:
    uv run ruff check .

fmt:
    uv run ruff format .

webapp-install:
    cd webapp && npm install

webapp-dev:
    cd webapp && npm run dev

webapp-build:
    cd webapp && npx tsc --noEmit && npm run build

mcpb-pack:
    uv run python scripts/mcpb_pack.py

ci: lint webapp-build test
