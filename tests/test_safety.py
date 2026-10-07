import pytest
from fastmcp.server.elicitation import (
    AcceptedElicitation,
    CancelledElicitation,
    DeclinedElicitation,
)

from stripe_mcp import safety


@pytest.fixture(autouse=True)
def isolated_data_dir(tmp_path, monkeypatch):
    monkeypatch.setattr(safety, "DATA_DIR", tmp_path)
    monkeypatch.setattr(safety, "LEDGER_PATH", tmp_path / "velocity_ledger.json")
    monkeypatch.setattr(safety, "AUDIT_LOG_PATH", tmp_path / "audit_log.jsonl")


def test_velocity_cap_allows_under_limit():
    assert safety.check_and_record_velocity("refund", 100.0, 500.0) is None
    assert safety.check_and_record_velocity("refund", 300.0, 500.0) is None


def test_velocity_cap_blocks_over_limit():
    safety.check_and_record_velocity("refund", 400.0, 500.0)
    error = safety.check_and_record_velocity("refund", 200.0, 500.0)
    assert error is not None
    assert "VelocityCapExceeded" in error


def test_velocity_cap_tracks_kinds_independently():
    assert safety.check_and_record_velocity("refund", 400.0, 500.0) is None
    assert safety.check_and_record_velocity("checkout", 400.0, 500.0) is None


def test_audit_log_round_trip():
    safety.audit_log({"tool": "manage_stripe_payments", "result": "blocked"})
    safety.audit_log({"tool": "manage_stripe_payments", "result": "executed"})
    events = safety.read_recent_audit_events()
    assert len(events) == 2
    assert events[0]["result"] == "executed"  # most recent first
    assert "ts" in events[0]


class _FakeContext:
    def __init__(self):
        self._state = {}

    async def get_state(self, key):
        return self._state.get(key)

    async def set_state(self, key, value, *, serializable=True):
        self._state[key] = value


@pytest.mark.asyncio
async def test_observed_id_round_trip():
    ctx = _FakeContext()
    assert await safety.is_observed(ctx, "charge", "ch_at_501") is False
    await safety.mark_observed(ctx, "charge", "ch_at_501")
    assert await safety.is_observed(ctx, "charge", "ch_at_501") is True
    assert await safety.is_observed(ctx, "charge", "ch_at_999") is False


@pytest.mark.asyncio
async def test_observed_id_none_context_is_unobserved():
    assert await safety.is_observed(None, "charge", "ch_at_501") is False
    # must not raise
    await safety.mark_observed(None, "charge", "ch_at_501")


class _FakeElicitContext:
    def __init__(self, response):
        self._response = response

    async def elicit(self, *args, **kwargs):
        if isinstance(self._response, Exception):
            raise self._response
        return self._response


@pytest.mark.asyncio
async def test_confirm_write_no_context_fails_closed():
    ok, error = await safety.confirm_write(None, "do the thing")
    assert ok is False
    assert error is not None


@pytest.mark.asyncio
async def test_confirm_write_accepted_true():
    ctx = _FakeElicitContext(AcceptedElicitation(data=True))
    ok, error = await safety.confirm_write(ctx, "do the thing")
    assert ok is True
    assert error is None


@pytest.mark.asyncio
async def test_confirm_write_accepted_false():
    ctx = _FakeElicitContext(AcceptedElicitation(data=False))
    ok, error = await safety.confirm_write(ctx, "do the thing")
    assert ok is False


@pytest.mark.asyncio
async def test_confirm_write_declined():
    ctx = _FakeElicitContext(DeclinedElicitation())
    ok, error = await safety.confirm_write(ctx, "do the thing")
    assert ok is False


@pytest.mark.asyncio
async def test_confirm_write_cancelled():
    ctx = _FakeElicitContext(CancelledElicitation())
    ok, error = await safety.confirm_write(ctx, "do the thing")
    assert ok is False


@pytest.mark.asyncio
async def test_confirm_write_unsupported_client_fails_closed():
    ctx = _FakeElicitContext(RuntimeError("client does not support elicitation"))
    ok, error = await safety.confirm_write(ctx, "do the thing")
    assert ok is False
    assert "fail-closed" in error
