from typing import Annotated, Any, Dict, Optional

from pydantic import Field

from stripe_mcp.austria_tax import validate_atu_vat_id
from stripe_mcp.config import settings
from stripe_mcp.models import CustomerOp

# Declared MOCK customers for zero-key evaluation
MOCK_CUSTOMERS = [
    {
        "id": "cus_at_101",
        "name": "Sandra Mockinger",
        "email": "sandra@vienna-tech.at",
        "country": "AT",
        "vat_id": "ATU12345678",
        "created": 1700000000,
        "livemode": False,
        "balance_eur": 0.00
    },
    {
        "id": "cus_at_102",
        "name": "Joe Mocky GmbH",
        "email": "billing@mocky-solutions.at",
        "country": "AT",
        "vat_id": "ATU87654321",
        "created": 1700100000,
        "livemode": False,
        "balance_eur": -150.00
    }
]

def handle_manage_customers(
    operation: Annotated[CustomerOp, Field(description="Customer operation enum (list, get, create, update, search)")],
    customer_id: Annotated[Optional[str], Field(description="Stripe customer ID (cus_...)")] = None,
    email: Annotated[Optional[str], Field(description="Customer email address")] = None,
    name: Annotated[Optional[str], Field(description="Customer legal name")] = None,
    vat_id: Annotated[Optional[str], Field(description="EU/Austrian VAT ID (e.g., ATU12345678)")] = None,
    country: Annotated[Optional[str], Field(description="ISO 2-letter country code (default AT)")] = None,
) -> Dict[str, Any]:
    """Manage Stripe customer records.

    ## Return Format
    Returns a dictionary with `success: True`, `operation`, and `data` (list or single customer record).

    ## Examples
    - `manage_stripe_customers(operation="list")`
    - `manage_stripe_customers(operation="create", email="billing@firm.at", name="Firm AT", vat_id="ATU12345678")`
    """
    if settings.is_mock_mode:
        if operation == CustomerOp.LIST:
            return {"success": True, "mode": "MOCK", "operation": "list", "data": MOCK_CUSTOMERS, "count": len(MOCK_CUSTOMERS)}

        if operation == CustomerOp.GET:
            cid = customer_id or "cus_at_101"
            found = next((c for c in MOCK_CUSTOMERS if c["id"] == cid), MOCK_CUSTOMERS[0])
            return {"success": True, "mode": "MOCK", "operation": "get", "data": found}

        if operation == CustomerOp.CREATE:
            vat_val = validate_atu_vat_id(vat_id) if vat_id else None
            new_cus = {
                "id": f"cus_at_{len(MOCK_CUSTOMERS)+101}",
                "name": name or "Neue Kundin",
                "email": email or "customer@example.at",
                "country": country or settings.default_country,
                "vat_id": vat_id,
                "vat_validation": vat_val,
                "created": 1700200000,
                "livemode": False
            }
            MOCK_CUSTOMERS.append(new_cus)
            return {"success": True, "mode": "MOCK", "operation": "create", "data": new_cus}

        if operation == CustomerOp.SEARCH:
            q = (email or name or "").lower()
            matched = [c for c in MOCK_CUSTOMERS if q in c["email"].lower() or q in c["name"].lower()]
            return {"success": True, "mode": "MOCK", "operation": "search", "data": matched, "count": len(matched)}

        return {"success": True, "mode": "MOCK", "operation": operation.value, "message": f"Operation {operation} executed successfully in mock mode."}

    # Live/Test Stripe API path
    import stripe
    stripe.api_key = settings.stripe_api_key

    try:
        if operation == CustomerOp.LIST:
            res = stripe.Customer.list(limit=20)
            return {"success": True, "mode": settings.stripe_mode, "operation": "list", "data": [c.to_dict() for c in res.data]}
        if operation == CustomerOp.GET:
            res = stripe.Customer.retrieve(customer_id)
            return {"success": True, "mode": settings.stripe_mode, "operation": "get", "data": res.to_dict()}
        if operation == CustomerOp.CREATE:
            params = {"email": email, "name": name, "address": {"country": country or "AT"}}
            if vat_id:
                params["tax_id_data"] = [{"type": "eu_vat", "value": vat_id}]
            res = stripe.Customer.create(**params)
            return {"success": True, "mode": settings.stripe_mode, "operation": "create", "data": res.to_dict()}
        return {"success": True, "mode": settings.stripe_mode, "operation": operation.value, "data": {}}
    except Exception as e:
        return {"success": False, "error": str(e)}
