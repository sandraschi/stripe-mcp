from stripe_mcp.austria_tax import (
    calculate_austrian_tax,
    validate_atu_vat_id,
)
from stripe_mcp.models import AustrianVatType


def test_standard_vat_calculation():
    res = calculate_austrian_tax(100.0, vat_type=AustrianVatType.STANDARD_20)
    assert res["net_amount"] == 100.0
    assert res["vat_rate_percent"] == 20
    assert res["vat_amount"] == 20.0
    assert res["gross_amount"] == 120.0
    assert res["reverse_charge_applied"] is False

def test_reduced_vat_calculation():
    res_10 = calculate_austrian_tax(100.0, vat_type=AustrianVatType.REDUCED_10)
    assert res_10["vat_amount"] == 10.0

    res_13 = calculate_austrian_tax(100.0, vat_type=AustrianVatType.REDUCED_13)
    assert res_13["vat_amount"] == 13.0

def test_atu_vat_id_validation():
    val1 = validate_atu_vat_id("ATU12345678")
    assert val1["is_valid"] is True
    assert val1["reverse_charge_eligible"] is True

    val2 = validate_atu_vat_id("atu87654321")
    assert val2["is_valid"] is True

    val3 = validate_atu_vat_id("ATU1234")
    assert val3["is_valid"] is False

    val4 = validate_atu_vat_id("DE123456789")
    assert val4["is_valid"] is False

def test_reverse_charge_vat_calculation():
    res = calculate_austrian_tax(100.0, customer_vat_id="ATU12345678")
    assert res["vat_rate_percent"] == 0
    assert res["vat_amount"] == 0.0
    assert res["gross_amount"] == 100.0
    assert res["reverse_charge_applied"] is True
    assert "Reverse Charge" in res["legal_note"]
