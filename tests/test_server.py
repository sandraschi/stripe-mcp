import pytest
from starlette.testclient import TestClient

from stripe_mcp.server import app


@pytest.fixture
def client():
    return TestClient(app)

def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "stripe-mcp"

def test_recent_webhooks(client):
    response = client.get("/api/webhooks/recent")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["webhooks"], list)

def test_webhook_ingest_mock(client):
    payload = {"id": "evt_test_123", "type": "customer.created"}
    response = client.post("/api/webhooks/stripe", json=payload)
    assert response.status_code == 200
    assert response.json()["success"] is True
