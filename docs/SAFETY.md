# Safety — `stripe-mcp`

`stripe-mcp` is a high-risk server: its job is to let an LLM agent move real money.
Per the fleet's high-risk-server documentation pattern (see `pywinauto-mcp`'s
`docs/SAFETY.md` for the desktop-control equivalent), this page is the canonical
reference for the threat model and every control that mitigates it. `README.md` and
`docs/HELP.md` summarize; this page is the detail.

## Threat model

This server does not itself ingest untrusted text (email, chat, scraped pages) — that
happens upstream, in whatever orchestrator or ingestion server (email-mcp,
discord-mcp, a WhatsApp bridge, a browser agent) feeds the LLM that eventually calls
`stripe-mcp`'s tools. The fleet's heavy ingestion-side defenses (randomized
spotlighting, dual-LLM quarantine — see `PROMPT_INJECTION_HARDENING.md`) belong on
those servers, not duplicated here.

**stripe-mcp's job is different: assume the orchestrator upstream got tricked anyway,
and minimize what that buys the attacker.** Every control below follows from that
premise — none of them trust the calling LLM's intent, because by the time a call
reaches this server, that intent may already be an attacker's, not the operator's.

## Controls

All of the following apply only to real Stripe calls (`STRIPE_API_KEY` set to a real
`rk_test_...`/`rk_live_...` key). **Mock mode is exempt from everything except
`STRIPE_READ_ONLY` and the amount caps** — with no real key configured, nothing here
can move real money, so demos and the documented tool examples stay frictionless.

### 1. Read-only by default (`STRIPE_READ_ONLY`)

Defaults to `true`. Blocks `issue_refund`, subscription `cancel`, customer `create`,
and all of `manage_stripe_checkout` (payment links, checkout sessions, invoices) —
applies in both mock and real modes, so you can verify the gate works without owning
a real key. Set to `false` only when a human deliberately wants the agent able to
write.

### 2. Per-call amount caps (`MAX_REFUND_AMOUNT_EUR`, `MAX_CHECKOUT_AMOUNT_EUR`)

Hard ceilings on a single refund or checkout/invoice amount, enforced in code and not
bypassable via arguments. Apply even with `STRIPE_READ_ONLY=false`. Defaults: €500 /
€5000.

### 3. Daily aggregate caps (`MAX_REFUND_TOTAL_EUR_PER_DAY`, `MAX_CHECKOUT_TOTAL_EUR_PER_DAY`)

A per-call cap alone doesn't stop an agent issuing 40 refunds of €499 each. These
track a rolling daily total per operation kind (`refund`, `checkout`) in
`data/velocity_ledger.json` and block the call that would push the day's total over
the limit. Real-mode only. Defaults: €2000 / day for refunds, €20000 / day for
checkout. Restarting the server does not reset the counter — it's keyed by calendar
date, not process lifetime.

### 4. Observed-ID scoping (`STRIPE_REQUIRE_OBSERVED_IDS`, default `true`)

`issue_refund` may only target a `charge_id`, and subscription `cancel` may only
target a `subscription_id`, that this **same MCP session** actually saw returned by a
prior `list_charges` / `list` call. This closes the most direct injection path: an
attacker-supplied instruction that says "refund charge ch_XXXXXXXX" for an ID the
agent was never shown by a legitimate read still gets rejected, because nothing in
this session observed that ID.

This is a heuristic, not a hard security boundary like the caps — it has a real
false-positive cost (an operator who already knows a charge ID from an external
support ticket, and tells the agent to refund it without first listing charges in
that same session, gets blocked too). That's why it's the one control here that ships
togglable rather than hardcoded: set `STRIPE_REQUIRE_OBSERVED_IDS=false` if that
workflow matters more to you than the injection protection it buys.

Session-scoped state uses FastMCP's built-in session state store (24h TTL); it does
not persist across a server restart or a new MCP session.

### 5. Human confirmation before every real write (elicitation)

Before executing `issue_refund`, subscription `cancel`, customer `create`, or any
`manage_stripe_checkout` operation against a real Stripe account, the server sends an
MCP elicitation request back to the client — a mid-call round-trip asking a human to
confirm the exact action (amount, target, reason) before it executes. This is the
strongest control on this list: it makes a human the actual authorizer of the write,
regardless of whether the calling LLM itself was manipulated by injected content.

**This fails closed.** If the client doesn't support elicitation, if the request
errors, if the human declines, or if the human cancels — the write is blocked, not
silently allowed through. There is no fallback path that treats "couldn't ask" as
"go ahead." See `src/stripe_mcp/safety.py::confirm_write`.

Practical implication: a client with no elicitation support cannot perform *any* real
write through this server, ever, regardless of `STRIPE_READ_ONLY`. That's intentional.

### 6. Idempotency keys

The live `Refund.create` and `checkout.Session.create` calls carry a deterministic
idempotency key derived from the call's own parameters. A network retry (client
timeout, connection drop) replays the same key instead of creating a second refund or
checkout session.

### 7. Startup least-privilege probe

At server startup (`server_lifespan` in `server.py`), if a real API key is configured,
the server attempts `stripe.Payout.list(limit=1)` — a resource this app never uses —
as a canary. If the call succeeds, the configured restricted key has broader scope
than the app needs, and a warning is logged so the operator can narrow it in the
Stripe Dashboard. There is no Stripe API to directly introspect a restricted key's own
granted scopes, so this only catches the specific case it probes for — it's a
best-effort defense-in-depth check against a code bug, not a complete audit.

### 8. Durable audit trail

Every write attempt — blocked or executed, and why — is appended to
`data/audit_log.jsonl` (`src/stripe_mcp/safety.py::audit_log`), independent of any
in-memory log that would be lost on restart. Read the most recent entries via
`GET /api/audit/recent`, or tail the file directly. Each record carries a UTC
timestamp, the tool/operation, the relevant IDs/amounts, and a `result` field
(`executed`, `blocked_read_only`, `blocked_amount_cap`, `blocked_velocity_cap`,
`blocked_unobserved_target`, `blocked_not_confirmed`, or `error`).

### 9. MCP tool annotations

Every tool carries `readOnlyHint` / `destructiveHint` / `openWorldHint` annotations
(`mcp.types.ToolAnnotations`, set in `server.py`) reflecting its real behavior — the
four write-capable portmanteau tools are all `readOnlyHint=False`, and
`manage_stripe_subscriptions` / `manage_stripe_payments` are additionally
`destructiveHint=True`. MCP hosts that respect these hints (Claude Desktop and others)
can use them to decide when to show a stronger confirmation prompt before even
calling the tool — this is the same mechanism Stripe's own documentation points to
("enable human confirmation of tools") as the client-side mitigation for prompt
injection. Control #5 above is the server-side version of the same idea: don't rely
on the client alone to enforce it.

## What this does *not* cover

- **Injection into the content an upstream agent reads.** That's the ingestion
  server's job (`PROMPT_INJECTION_HARDENING.md`).
- **A compromised or malicious MCP client.** Elicitation confirmation only helps if
  the client faithfully relays the confirmation prompt to an actual human and reports
  their actual answer back. A client built to always answer "yes" defeats it — this
  server has no way to verify that.
- **Full key-scope introspection.** The least-privilege probe (#7) is a canary against
  one specific over-grant, not a complete audit. Review the restricted key's scopes
  directly in the Stripe Dashboard when provisioning it.

## Notes on `manage_stripe_checkout`'s live implementation

All three operations call the real Stripe API against a live/test key:
`create_checkout_session` → `stripe.checkout.Session.create`, `create_payment_link` →
`stripe.PaymentLink.create` (inline `price_data`, no separate Price object left
behind), `create_invoice` → `stripe.InvoiceItem.create` +
`stripe.Invoice.create` + `stripe.Invoice.finalize_invoice`.

`create_invoice` additionally requires `customer_id` against a real account — Stripe
invoices must be attached to an existing customer, so a call without one is rejected
before touching the network (`blocked_missing_customer_id` in the audit log) rather
than failing inside a raw Stripe API error. Mock mode has no such requirement (it
defaults to a synthetic customer), since nothing real is being created.

## Configuration reference

See [`CONFIGURATION.md`](CONFIGURATION.md#gating-model) for the full environment
variable table and exactly which operations each one gates.
