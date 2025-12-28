# API Documentation

## Architecture Overview

CoinTracer follows a microservices architecture with the following services:
- User Service (Port: TBD)
- Exchange Connections Service (Port: TBD)
- Market Data Service (Port: 5001)
- Personalization Service (Port: TBD)
- Alerts Service (Port: TBD)

All authenticated endpoints require JWT token in the `Authorization` header: `Bearer <token>`

---

## User Service

Base URL: `/api/v1/auth`

### Authentication Endpoints

#### Register User
```
POST /register
Body: { email, password, username }
Response: { user, token }
```

#### Login
```
POST /login
Body: { email, password }
Response: { token, user }
```

#### Forgot Password
```
POST /forgot-password
Body: { email }
Response: { message }
```

#### Reset Password
```
POST /reset-password
Body: { token, newPassword }
Response: { message }
```

### User Profile Endpoints (Authenticated)

#### Get Profile
```
GET /profile
Headers: Authorization: Bearer <token>
Response: { user profile data }
```

#### Update Profile
```
PUT /profile
Headers: Authorization: Bearer <token>
Body: { profile updates }
Response: { updated user }
```

#### Delete Account
```
DELETE /account
Headers: Authorization: Bearer <token>
Response: { message }
```

---

## Exchange Connections Service

Base URL: `/api/v1`

All endpoints require authentication.

### Exchange Management

#### Get Supported Exchanges
```
GET /exchange/supported-exchanges
Response: [ { name, id, features } ]
```

#### Get User Connections
```
GET /exchange/connections
Response: [ { connectionId, exchange, status, createdAt } ]
```

#### Connect Exchange
```
POST /exchange/connections
Body: { exchange, apiKey, apiSecret, additionalConfig }
Response: { connectionId, status }
```

#### Disconnect Exchange
```
DELETE /exchange/connections/:connectionId
Response: { message }
```

#### Sync Exchange Data
```
POST /exchange/connections/:connectionId/sync
Response: { syncStatus, timestamp }
```

#### Get Sync Status
```
GET /exchange/connections/:connectionId/status
Response: { status, lastSync, progress }
```

#### Get Balances
```
GET /exchange/connections/:connectionId/balances
Response: { balances: [ { asset, amount, value } ] }
```

#### Get Average Prices
```
GET /exchange/connections/:connectionId/average-prices
Response: { averagePrices: [ { asset, avgPrice } ] }
```

#### Get Breakeven Prices
```
GET /exchange/connections/:connectionId/breakeven-prices
Response: { breakevenPrices: [ { asset, breakevenPrice } ] }
```

### Portfolio Management

#### Create Portfolio
```
POST /portfolio
Body: { name, description }
Response: { portfolioId, name, createdAt }
```

#### Get All Portfolios
```
GET /portfolio
Response: [ { portfolioId, name, totalValue, holdings } ]
```

#### Get Portfolio Details
```
GET /portfolio/:portfolioId
Response: { portfolio details, holdings, performance }
```

#### Update Portfolio
```
PUT /portfolio/:portfolioId
Body: { name, description }
Response: { updated portfolio }
```

#### Delete Portfolio
```
DELETE /portfolio/:portfolioId
Response: { message }
```

#### Sync Portfolio from Connection
```
POST /portfolio/sync/:connectionId
Response: { syncedData, timestamp }
```

### Transaction Management

#### Add Transaction
```
POST /portfolio/:portfolioId/transactions
Body: { type, asset, amount, price, timestamp }
Response: { transactionId, details }
```

#### Get Transactions
```
GET /portfolio/:portfolioId/transactions
Query: ?limit=20&offset=0&type=buy|sell
Response: { transactions: [], pagination }
```

#### Get Transactions by Type
```
GET /portfolio/:portfolioId/transactions/filter
Query: ?type=buy|sell|transfer
Response: { transactions: [] }
```

#### Get Conversion History
```
GET /portfolio/:portfolioId/conversions
Response: { conversions: [] }
```

#### Get Spot Trading History
```
GET /portfolio/:portfolioId/spot-trades
Response: { trades: [] }
```

#### Update Transaction
```
PUT /portfolio/:portfolioId/transactions/:transactionId
Body: { updated fields }
Response: { updated transaction }
```

#### Delete Transaction
```
DELETE /portfolio/:portfolioId/transactions/:transactionId
Response: { message }
```

### Portfolio Analytics

#### Get Asset Allocation
```
GET /portfolio/:portfolioId/allocation
Response: { allocation: [ { asset, percentage, value } ] }
```

#### Get Portfolio with PnL
```
GET /portfolio/:portfolioId/pnl
Response: { portfolio, totalPnL, unrealizedPnL, realizedPnL }
```

#### Export to CSV
```
GET /portfolio/:portfolioId/export/csv
Response: CSV file download
```

### Manual Holdings

#### Get Manual Holdings
```
GET /manual-holdings/:portfolioId
Response: { holdings: [ { asset, amount, avgPrice } ] }
```

#### Add/Update Manual Holding
```
POST /manual-holdings/:portfolioId
Body: { assetSymbol, amount, avgPrice }
Response: { holding details }
```

#### Delete Manual Holding
```
DELETE /manual-holdings/:portfolioId/:assetSymbol
Response: { message }
```

---

## Market Data Service

Base URL: `/api/v1`

### Market Data Endpoints

#### Get Price (Single Asset)
```
GET /market/prices/:assetId
Query: ?vs=USD
Response: { assetId, price, change24h, marketCap, volume24h }
```

#### Get Prices (Batch)
```
GET /market/prices/batch
Query: ?assets=BTC,ETH,BNB&vs=USD
Response: { data: [ { symbol, price, change24h, ... } ], vs }
```

#### Search Assets
```
GET /market/assets/search
Query: ?q=bitcoin&limit=10
Response: [ { id, symbol, name, rank } ]
```

#### Get Asset Details
```
GET /market/assets/:symbol/details
Response: { symbol, name, description, website, socials, ... }
```

#### Get Asset Chart Data
```
GET /market/assets/:symbol/chart
Query: ?interval=1d&range=30d
Response: { prices: [ [timestamp, price] ], volumes: [] }
```

#### Get Service Status
```
GET /market/status
Response: { status, apiHealth, lastUpdate }
```

### Dashboard

#### Get Dashboard Summary
```
GET /dashboard/summary
Response: { topGainers, topLosers, totalMarketCap, btcDominance }
```

### News Endpoints

#### Get Latest News
```
GET /news
Query: ?limit=20&category=crypto
Response: { articles: [ { title, url, source, publishedAt } ] }
```

#### Get News for Specific Asset
```
GET /news/asset/:symbol
Query: ?limit=10
Response: { articles: [] }
```

#### Get News Sources
```
GET /news/sources
Response: [ { name, id, url } ]
```

---

## Personalization Service

Base URL: `/api/v1`

All endpoints require authentication.

### Favorites Management

#### Get User Favorites
```
GET /favorites
Query: ?vs=USD
Response: { 
  count: 5,
  vs: "USD",
  favorites: [ { assetId, symbol, name, price, priceChange24h, ... } ]
}
```

#### Add to Favorites
```
POST /favorites
Body: { assetId: "BTC" }
Response: { assetId, userId, createdAt }
Status: 201 Created | 409 Conflict (already exists)
```

#### Remove from Favorites
```
DELETE /favorites/:assetId
Response: { message }
Status: 200 OK | 404 Not Found
```

---

## Alerts Service

Base URL: `/api/v1/alerts`

All endpoints require authentication.

### Alert Management

#### Create Alert
```
POST /
Body: {
  assetId: "BTC",
  type: "price_above|price_below|percent_change",
  targetValue: 50000,
  message: "BTC reached target"
}
Response: { alertId, ...alertDetails }
```

#### Get All Alerts
```
GET /
Query: ?status=active|triggered|all
Response: [ { alertId, assetId, type, targetValue, status, ... } ]
```

#### Get Alert by ID
```
GET /:id
Response: { alert details }
```

#### Update Alert
```
PUT /:id
Body: { targetValue, message, enabled }
Response: { updated alert }
```

#### Delete Alert
```
DELETE /:id
Response: { message }
```

#### Reset Triggered Alert
```
POST /:id/reset
Response: { alert with status reset to active }
```

#### Test Alert
```
POST /:id/test
Response: { 
  wouldTrigger: true|false,
  currentValue: ...,
  targetValue: ...
}
```

---

## Common Response Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

## Error Response Format

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Health Check

All services expose a health check endpoint:
```
GET /health
Response: { service, version, status, uptime }
```
