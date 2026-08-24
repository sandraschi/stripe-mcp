# Configuration Reference — `stripe-mcp`

All environment variables supported by `stripe-mcp`:

| Environment Variable | Type | Default | Description |
|---|---|---|---|
| `PORT` | Integer | `11165` | Backend Starlette API & FastMCP server port |
| `WEB_PORT` | Integer | `11166` | Frontend Vite React dashboard port |
| `STRIPE_API_KEY` | String | `rk_test_mock...` | Stripe Restricted Key (`rk_test_...` or `rk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | String | `whsec_mock...` | Webhook endpoint secret from Stripe Dashboard |
| `STRIPE_MODE` | Enum | `test` | Operating environment (`test` or `live`) |
| `STRIPE_READ_ONLY` | Boolean | `false` | When `true`, blocks mutation operations (refunds, cancellations) |
| `MAX_REFUND_AMOUNT_EUR` | Float | `500.00` | Safety cap threshold for automated agent refunds |
| `DEFAULT_CURRENCY` | String | `EUR` | ISO currency code (default Euro) |
| `DEFAULT_COUNTRY` | String | `AT` | Country code (default Austria) |
| `DEFAULT_VAT_RATE` | Float | `0.20` | Standard VAT rate for Austria (20%) |
| `ENABLE_EU_VAT_VALIDATION` | Boolean | `true` | Enables ATU / EU VAT ID syntax & VIES checks |
