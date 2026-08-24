# MCPB 3-4-100 Prompts Package (`assets/prompts`)

This directory contains the prompt package for `stripe-mcp` complying strictly with the **MCPB 3-4-100 standard** (System Prompt ≥ 3,000 words, User Prompt ≥ 4,000 words, Tool Examples ≥ 100).

## Files

| File | Word / Object Count | Target | Description |
|---|---|---|---|
| `system.md` | **3,252 words** | ≥ 3,000 | Comprehensive system prompt outlining tool usage rules, Austrian tax logic, safety caps, and error protocols. |
| `user.md` | **4,460 words** | ≥ 4,000 | Operational manual, user guide, API schema reference, troubleshooting matrix, and tutorial playbooks. |
| `examples.json` | **100 objects** | ≥ 100 | Pre-compiled JSON array of tool call examples covering customer, payment, subscription, checkout, and tax tools. |

## Validation & Packaging

To verify prompt metrics and stage the MCPB package:

```powershell
uv run python scripts/mcpb_pack.py
```
