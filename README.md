# CoinTracer - Digital Asset Portfolio Tracker

A comprehensive cryptocurrency portfolio management platform that enables users to track their digital assets across multiple exchanges, analyze performance metrics, and monitor market trends in real-time.

## Overview

CoinTracer is a modern web application built with a microservices architecture that provides cryptocurrency investors with powerful tools to manage and analyze their portfolios. The platform integrates with major cryptocurrency exchanges (Binance, Bitget, KuCoin, BingX) to automatically sync transactions and balances, offering users a unified view of their investments across platforms.

### Key Features

- **Multi-Exchange Integration**: Connect and sync portfolios from Binance, Bitget, KuCoin, and BingX
- **Real-Time Market Data**: Live price tracking and market statistics powered by CoinMarketCap
- **Portfolio Analytics**: Comprehensive profit/loss calculations, allocation analysis, and performance metrics
- **Transaction Management**: Automated transaction sync including trades, deposits, withdrawals, and conversions
- **Manual Asset Tracking**: Add and manage assets not connected to exchanges
- **Price Alerts**: Customizable alerts for price targets and percentage changes
- **News Aggregation**: Latest cryptocurrency news from multiple sources
- **Secure Authentication**: JWT-based authentication with secure API key encryption

### Technology Stack

**Frontend:**
- React 18 with Vite
- Recharts for data visualization
- Tailwind CSS for styling
- Axios for API communication

**Backend:**
- Node.js with Express
- PostgreSQL database
- Microservices architecture
- JWT authentication
- RESTful API design

**Infrastructure:**
- GitHub Actions for CI/CD
- Automated testing with Jest
- Code quality checks with ESLint
- Coverage reporting



## Architecture

CoinTracer follows a microservices architecture with the following services:

### Backend Services

1. **User Service** (Port 3001)
   - User registration and authentication
   - Profile management
   - Password reset functionality

2. **Exchange Connections Service** (Port 5000)
   - Exchange API integration
   - Portfolio management
   - Transaction synchronization
   - Manual holdings management

3. **Market Data Service** (Port 5001)
   - Real-time price data from CoinMarketCap
   - Historical market data
   - Cryptocurrency news aggregation
   - Market statistics and trends

4. **Alerts Service** (Port 5002)
   - Price alert configuration
   - Alert monitoring and triggering
   - Notification management

5. **Personalization Service** (Port 5003)
   - User favorites management
   - Preferences storage

### Frontend Application

- **React SPA** (Port 5173)
  - Modern, responsive user interface
  - Real-time data visualization
  - Interactive portfolio management

### Shared Components

- Common middleware (authentication, CORS, error handling)
- Database connection pooling
- Logging utilities
- Health check endpoints


## Quick Start

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL 14.x or higher
- npm or yarn package manager
- Git

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/pestechnology/PESU_RR_CSE_G_P25_Digital_Asset_and_Cryptocurrency_Portfolio_Tracker_CoinTracer.git
   cd PESU_RR_CSE_G_P25_Digital_Asset_and_Cryptocurrency_Portfolio_Tracker_CoinTracer
   ```

2. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb cointracer
   
   # Run schema migrations
   psql -d cointracer -f db/schema.sql
   
   # (Optional) Load seed data
   psql -d cointracer -f db/seed.sql
   ```

3. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install service dependencies
   cd user-service && npm install && cd ..
   cd exchange-connections-service && npm install && cd ..
   cd market-data-service && npm install && cd ..
   cd alerts-service && npm install && cd ..
   cd personalization-service && npm install && cd ..
   cd shared && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

4. **Configure Environment Variables**
   
   Create `.env` files in each service directory with required variables:
   
   ```bash
   # User Service (.env)
   PORT=3001
   DATABASE_URL=postgresql://user:password@localhost:5432/cointracer
   JWT_SECRET=your_jwt_secret_here
   
   # Exchange Connections Service (.env)
   PORT=5000
   DATABASE_URL=postgresql://user:password@localhost:5432/cointracer
   ENCRYPTION_KEY=your_32_character_encryption_key
   
   # Market Data Service (.env)
   PORT=5001
   COINMARKETCAP_API_KEY=your_cmc_api_key
   
   # Alerts Service (.env)
   PORT=5002
   DATABASE_URL=postgresql://user:password@localhost:5432/cointracer
   MARKET_DATA_SERVICE_URL=http://localhost:5001
   
   # Personalization Service (.env)
   PORT=5003
   DATABASE_URL=postgresql://user:password@localhost:5432/cointracer
   
   # Frontend (.env)
   VITE_API_BASE_URL=http://localhost:5000
   VITE_USER_SERVICE_URL=http://localhost:3001
   VITE_MARKET_DATA_URL=http://localhost:5001
   ```

5. **Start the Application**
   
   Option A - Start all services individually:
   ```bash
   # Terminal 1 - User Service
   cd user-service && npm start
   
   # Terminal 2 - Exchange Service
   cd exchange-connections-service && npm start
   
   # Terminal 3 - Market Data Service
   cd market-data-service && npm start
   
   # Terminal 4 - Alerts Service
   cd alerts-service && npm start
   
   # Terminal 5 - Personalization Service
   cd personalization-service && npm start
   
   # Terminal 6 - Frontend
   cd frontend && npm run dev
   ```
   
   Option B - Use the development script (requires `concurrently`):
   ```bash
   npm run dev
   ```

6. **Access the Application**
   
   Open your browser and navigate to: `http://localhost:5173`

## Project Structure

```
PESU_RR_CSE_G_P25_Digital_Asset_and_Cryptocurrency_Portfolio_Tracker_CoinTracer/
├── frontend/                    # React frontend application
├── user-service/                # User authentication and management
├── exchange-connections-service/# Portfolio and exchange integrations
├── market-data-service/         # Market data and price feeds
├── personalization-service/     # User preferences and favorites
├── shared/                      # Shared utilities and middleware
├── db/                          # Database schema and seeds
├── .github/                     # GitHub workflows and templates
└── README.md
```

## Development Guidelines

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[API Documentation](docs/API.md)** - Complete API reference for all services
- **[CI/CD Pipeline](docs/CI_CD.md)** - Continuous integration and deployment guide
- **[Database Schema](db/README.md)** - Database structure and relationships
- **[Testing Guide](docs/TESTING.md)** - Testing strategy and coverage information

## Testing

The project includes comprehensive test suites for all services.

### Running Tests

```bash
# Run all service tests
npm run test:all

# Run tests with coverage
npm run test:coverage

# Run specific service tests
cd user-service && npm test
cd exchange-connections-service && npm test
cd market-data-service && npm test
cd alerts-service && npm test
```

### Test Coverage

Current test coverage includes:
- User authentication and authorization flows
- Portfolio and transaction management
- Exchange integration and synchronization
- Market data retrieval and caching
- Alert creation and triggering
- Manual holdings CRUD operations

All tests run automatically in the CI/CD pipeline on every push and pull request.
