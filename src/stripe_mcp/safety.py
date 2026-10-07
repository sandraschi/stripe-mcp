"""Defense-in-depth controls for stripe-mcp write operations.

These sit on top of the STRIPE_READ_ONLY gate and per-call amount caps
(config.py / server.py). They only apply to real Stripe calls (test or live
mode) -- mock mode stays frictionless since no real money can move.

- confirm_write: mid-call human confirmation via MCP elicitation (fails closed).
- check_and_record_velocity: rolling-daily aggregate cap per operation kind,
  catches "many small calls" abuse that a single-call cap doesn't.
- mark_observed / is_observed: a write may only target an ID this session
  actually saw returned by a prior read (list/get) call -- blocks an injected
  instruction from naming an arbitrary target the agent was never shown.
- audit_log: durable JSONL trail of every write attempt, blocked or executed.
"""

import json
import logging
import threading
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

from fastmcp import Context
from fastmcp.server.elicitation import AcceptedElicitation, DeclinedElicitation

logger = logging.getLogger("stripe_mcp.safety")

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
LEDGER_PATH = DATA_DIR / "velocity_ledger.json"
AUDIT_LOG_PATH = DATA_DIR / "audit_log.jsonl"

_ledger_lock = threading.Lock()
_audit_lock = threading.Lock()


async def confirm_write(ctx: Optional[Context], summary: str) -> Tuple[bool, Optional[str]]:
    """Require explicit human confirmation via MCP elicitation before a write executes.

    Fails closed: a missing context, a declined/cancelled response, or a client
    that doesn't support elicitation all block the write rather than allowing it.
    """
    if ctx is None:
        return False, "No MCP request context available for confirmation; write blocked (fail-closed)."
    try:
        result = await ctx.elicit(
            f"{summary}\n\nConfirm this action?",
            response_type=bool,
            response_title="Confirm",
        )
    except Exception as e:
        return False, f"Elicitation failed or unsupported by this client ({e}); write blocked (fail-closed)."

    if isinstance(result, AcceptedElicitation):
        if result.data is True:
            return True, None
        return False, "User declined confirmation."
    if isinstance(result, DeclinedElicitation):
        return False, "User declined confirmation."
    return False, "User cancelled confirmation."


def _load_ledger() -> Dict[str, Any]:
    if not LEDGER_PATH.exists():
        return {}
    try:
        return json.loads(LEDGER_PATH.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}


def check_and_record_velocity(kind: str, amount: float, daily_cap: float) -> Optional[str]:
    """Enforce a rolling-daily aggregate cap per operation kind (e.g. 'refund', 'checkout').

    Returns an error string if this call would push today's total over `daily_cap`
    (and does NOT record it); otherwise records the amount and returns None.
    """
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    today = date.today().isoformat()
    with _ledger_lock:
        ledger = _load_ledger()
        day_bucket = ledger.get(today, {})
        current = day_bucket.get(kind, 0.0)
        if current + amount > daily_cap:
            return (
                f"VelocityCapExceeded: today's {kind} total would reach "
                f"EUR {current + amount:.2f}, exceeding the EUR {daily_cap:.2f} daily limit "
                f"(EUR {current:.2f} already used today)."
            )
        day_bucket[kind] = current + amount
        # keep only today's bucket -- this is a rolling daily cap, not a history log
        LEDGER_PATH.write_text(json.dumps({today: day_bucket}), encoding="utf-8")
    return None


async def mark_observed(ctx: Optional[Context], kind: str, id_: Optional[str]) -> None:
    """Record that this session actually saw `id_` returned by a read operation."""
    if ctx is None or not id_:
        return
    key = f"observed_{kind}"
    seen = await ctx.get_state(key) or []
    if id_ not in seen:
        seen.append(id_)
        await ctx.set_state(key, seen[-200:])  # bounded, oldest dropped first


async def is_observed(ctx: Optional[Context], kind: str, id_: Optional[str]) -> bool:
    if ctx is None or not id_:
        return False
    seen = await ctx.get_state(f"observed_{kind}") or []
    return id_ in seen


def audit_log(event: Dict[str, Any]) -> None:
    """Append-only JSONL trail of write attempts, durable across restarts."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    record = {"ts": datetime.now(timezone.utc).isoformat(), **event}
    try:
        with _audit_lock:
            with AUDIT_LOG_PATH.open("a", encoding="utf-8") as f:
                f.write(json.dumps(record) + "\n")
    except OSError as e:
        logger.error(f"Failed to write audit log entry: {e}")


def read_recent_audit_events(limit: int = 50) -> list:
    if not AUDIT_LOG_PATH.exists():
        return []
    try:
        lines = AUDIT_LOG_PATH.read_text(encoding="utf-8").splitlines()
    except OSError:
        return []
    events = []
    for line in lines[-limit:]:
        try:
            events.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    events.reverse()
    return events
