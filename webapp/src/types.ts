export interface Customer {
  id: string;
  name: string;
  email: string;
  vat_id?: string;
  country: string;
  created_at: number;
}

export interface Subscription {
  id: string;
  customer_id: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  current_period_end: number;
}

export interface Charge {
  id: string;
  customer_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  receipt_url?: string;
  created_at: number;
}

export interface Invoice {
  id: string;
  customer_id: string;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  status: string;
  created_at: number;
}

export interface WebhookEvent {
  id: string;
  type: string;
  created_at: number;
  data: Record<string, any>;
}

export interface RevenueKPIs {
  mrr: number;
  active_subscriptions: number;
  churn_rate: number;
  monthly_vat_collected_eur: number;
  currency: string;
  livemode: boolean;
}
