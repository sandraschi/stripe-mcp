import os
from dataclasses import dataclass


@dataclass
class Settings:
    port: int = int(os.getenv("PORT", "11165"))
    web_port: int = int(os.getenv("WEB_PORT", "11166"))
    stripe_api_key: str = os.getenv("STRIPE_API_KEY", "rk_test_mock_key_for_development")
    stripe_webhook_secret: str = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_mock_webhook_secret")
    stripe_mode: str = os.getenv("STRIPE_MODE", "test").lower()
    stripe_read_only: bool = os.getenv("STRIPE_READ_ONLY", "false").lower() in ("true", "1", "yes")
    max_refund_amount_eur: float = float(os.getenv("MAX_REFUND_AMOUNT_EUR", "500.00"))
    default_currency: str = os.getenv("DEFAULT_CURRENCY", "EUR").upper()
    default_country: str = os.getenv("DEFAULT_COUNTRY", "AT").upper()
    default_vat_rate: float = float(os.getenv("DEFAULT_VAT_RATE", "0.20"))
    enable_eu_vat_validation: bool = os.getenv("ENABLE_EU_VAT_VALIDATION", "true").lower() in ("true", "1", "yes")

    @property
    def is_mock_mode(self) -> bool:
        return "mock" in self.stripe_api_key.lower() or self.stripe_api_key == "rk_test_mock_key_for_development"

settings = Settings()
