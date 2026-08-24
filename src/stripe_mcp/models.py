from enum import Enum
from typing import Optional

from pydantic import BaseModel


class CustomerOp(str, Enum):
    LIST = "list"
    GET = "get"
    CREATE = "create"
    UPDATE = "update"
    SEARCH = "search"

class SubscriptionOp(str, Enum):
    LIST = "list"
    GET = "get"
    CANCEL = "cancel"
    PAUSE = "pause"
    RESUME = "resume"

class PaymentOp(str, Enum):
    LIST_CHARGES = "list_charges"
    GET_PAYMENT_INTENT = "get_payment_intent"
    ISSUE_REFUND = "issue_refund"
    GET_DISPUTES = "get_disputes"

class CheckoutOp(str, Enum):
    CREATE_PAYMENT_LINK = "create_payment_link"
    CREATE_CHECKOUT_SESSION = "create_checkout_session"
    CREATE_INVOICE = "create_invoice"

class AnalyticsMetric(str, Enum):
    MRR = "mrr"
    CHURN = "churn"
    DISPUTES = "disputes"
    VAT_SUMMARY = "vat_summary"
    ALL = "all"

class AustrianVatType(str, Enum):
    STANDARD_20 = "standard_20"
    REDUCED_10 = "reduced_10"
    REDUCED_13 = "reduced_13"

class CustomerRecord(BaseModel):
    id: str
    email: str
    name: str
    country: str = "AT"
    vat_id: Optional[str] = None
    created_at: str
    livemode: bool = False

class InvoiceRecord(BaseModel):
    id: str
    customer_id: str
    customer_name: str
    subtotal: float
    vat_rate: float
    vat_amount: float
    total: float
    currency: str = "EUR"
    seller_uid: str = "ATU78901234"
    bao_retention_years: int = 7
    status: str = "paid"
