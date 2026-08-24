import json
import logging
from typing import Any, Dict, List

logger = logging.getLogger("stripe_mcp.webhook")

# In-memory store for recent webhook events
recent_webhooks: List[Dict[str, Any]] = []

def process_webhook_payload(payload_bytes: bytes, sig_header: str, webhook_secret: str) -> Dict[str, Any]:
    """
    Processes and logs incoming Stripe webhook events.
    Returns parsed event structure.
    """
    try:
        data = json.loads(payload_bytes.decode("utf-8"))
        event_type = data.get("type", "unknown.event")
        event_id = data.get("id", "evt_mock_123")

        event_record = {
            "id": event_id,
            "type": event_type,
            "data": data.get("data", {}).get("object", {}),
            "received_at": data.get("created", 1700000000),
            "status": "processed"
        }

        recent_webhooks.insert(0, event_record)
        if len(recent_webhooks) > 50:
            recent_webhooks.pop()

        logger.info(f"Processed Stripe webhook event {event_type} ({event_id})")
        return {"success": True, "event_id": event_id, "event_type": event_type}
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        return {"success": False, "error": str(e)}

def get_recent_webhooks() -> List[Dict[str, Any]]:
    return recent_webhooks
