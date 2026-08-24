# Troubleshooting Guide — `stripe-mcp`

## Common Issues & Solutions

### 1. `StripeError: Invalid API Key`
- **Symptom**: Requests return `401 Unauthorized` or invalid key error.
- **Fix**: Check `.env` file. Ensure `STRIPE_API_KEY` starts with `rk_test_`, `rk_live_`, `sk_test_`, or `sk_live_`.

### 2. `Webhook Signature Verification Failed`
- **Symptom**: Webhook logs show `400 Bad Request` on `POST /api/webhooks/stripe`.
- **Fix**: Verify `STRIPE_WEBHOOK_SECRET` matches the signing secret (`whsec_...`) in your Stripe Dashboard.

### 3. `Invalid ATU VAT ID`
- **Symptom**: Reverse Charge validation fails for an Austrian customer.
- **Fix**: Ensure the input format starts with `ATU` followed by 8 digits (e.g. `ATU12345678`).

### 4. `Refund Amount Exceeds Safety Cap`
- **Symptom**: `manage_stripe_payments(operation="issue_refund")` fails with `SafetyCapExceeded`.
- **Fix**: Adjust `MAX_REFUND_AMOUNT_EUR` in `.env` if higher refund limits are required.

### 5. `Port 11165 / 11166 in Use`
- **Symptom**: Webapp or API fails to bind to port.
- **Fix**: Launch using `.\start.ps1`. The start script automatically terminates zombie processes on ports 11165 and 11166.
