# Testing Strategy Documentation

## Overview

CoinTracer implements a comprehensive testing strategy covering unit tests, integration tests, and end-to-end tests. The project uses Jest as the primary testing framework across all services.

---

## Testing Framework

### Primary Tools
- **Jest** (v29.7.0 - v30.2.0)
- **Supertest** (HTTP testing)
- **pg-mem** (In-memory PostgreSQL for User Service)

### Test Organization

```
service-name/
  __tests__/           # Test files
    *.test.js          # Test suites
  coverage/            # Generated coverage reports
    lcov-report/       # HTML coverage report
    clover.xml         # Clover format
    lcov.info          # LCOV format
```

---

## Test Types

### 1. Unit Tests

**Purpose:** Test individual functions, methods, and components in isolation

**Coverage Areas:**
- Controllers
- Services
- Models
- Utility functions

**Example Services:**
- `alert.controller.test.js`
- `alert.service.test.js`
- `alert.model.test.js`

**Mocking Strategy:**
- Mock external dependencies
- Mock database calls
- Mock API requests

---

### 2. Integration Tests

**Purpose:** Test interactions between components and external services

**Coverage Areas:**
- API endpoint workflows
- Database operations
- Service-to-service communication

**Example:**
- `integration.test.js` (Exchange Connections Service)
- Portfolio CRUD operations
- Transaction management

**Database Strategy:**
- PostgreSQL test database
- Schema loaded before tests
- Transactions rolled back after tests

---

### 3. End-to-End Tests

**Purpose:** Test complete user workflows across multiple services

**Scope:**
- Full authentication flow
- Portfolio creation and management
- Market data retrieval
- Alert creation and triggering

**Environment:**
- All services running
- Shared PostgreSQL instance
- Real HTTP requests

---

## Service-Specific Testing

### User Service

**Test Location:** `user-service/tests/`

**Test Configuration:**
```json
{
  "testEnvironment": "node",
  "testMatch": ["**/tests/**/*.test.js"],
  "collectCoverageFrom": [
    "controllers/**/*.js",
    "routes/**/*.js"
  ]
}
```

**Key Test Files:**
- Authentication tests
- User profile management
- Password reset flows

**Database:** pg-mem (in-memory PostgreSQL)

**Run Commands:**
```bash
npm test -w user-service
npm run test:coverage -w user-service
npm run test:watch -w user-service
```

---

### Exchange Connections Service

**Test Location:** `exchange-connections-service/__tests__/`

**Test Configuration:**
```json
{
  "testEnvironment": "node",
  "testMatch": ["**/__tests__/**/*.test.js"],
  "collectCoverageFrom": [
    "controllers/**/*.js",
    "services/**/*.js",
    "models/**/*.js",
    "routes/**/*.js"
  ]
}
```

**Test Categories:**

1. **Exchange Service Tests:**
   - `binance.service.test.js`
   - `bingx.service.test.js`
   - `bitget.service.test.js`
   - `kucoin.service.test.js`

2. **Factory Pattern Tests:**
   - `exchangeFactory.service.test.js`
   - `exchangeFactory.service.comprehensive.test.js`

3. **Model Tests:**
   - `exchangeConnection.model.test.js`
   - `holding.model.test.js`
   - `portfolio.model.test.js`
   - `transaction.model.test.js`
   - `manualHolding.model.test.js`

4. **Controller Tests:**
   - `exchange.controller.test.js`
   - `portfolio.controller.test.js`
   - `manualHolding.controller.test.js`

5. **Business Logic Tests:**
   - `portfolio.service.test.js`
   - `portfolio.pnl.test.js`
   - `transaction.crud.test.js`

6. **Integration Tests:**
   - `integration.test.js`

**Run Commands:**
```bash
npm test -w exchange-connections-service
npm test -w exchange-connections-service -- --forceExit
npm run test:coverage -w exchange-connections-service
```

---

### Market Data Service

**Test Location:** `market-data-service/__tests__/`

**Test Configuration:**
```json
{
  "testEnvironment": "node",
  "testMatch": ["**/__tests__/**/*.test.js"]
}
```

**Key Test Areas:**
- Price fetching (single and batch)
- Asset search functionality
- News aggregation
- Dashboard summary generation
- External API integration

**Run Commands:**
```bash
npm test -w market-data-service
npm run dev -w market-data-service  # Development mode
```

---

### Alerts Service

**Test Location:** `alerts-service/__tests__/`

**Test Configuration:**
```json
{
  "testEnvironment": "node",
  "testMatch": ["**/__tests__/**/*.test.js"],
  "collectCoverageFrom": [
    "controllers/**/*.js",
    "services/**/*.js",
    "routes/**/*.js"
  ]
}
```

**Test Files:**
- `alert.controller.test.js` - API endpoint tests
- `alert.service.test.js` - Business logic tests
- `alert.model.test.js` - Data model tests
- `alertWorker.service.test.js` - Background worker tests

**Alert Types Tested:**
- Price above threshold
- Price below threshold
- Percentage change alerts

**Run Commands:**
```bash
npm test -w alerts-service
npm run test:coverage -w alerts-service
npm run dev -w alerts-service
```

---

### Personalization Service

**Test Location:** `personalization-service/__tests__/`

**Test Configuration:**
```json
{
  "testEnvironment": "node",
  "testMatch": ["**/__tests__/**/*.test.js"]
}
```

**Key Test Areas:**
- User favorites management
- Market data integration
- Batch price fetching for favorites

**Run Commands:**
```bash
npm test -w personalization-service
npm run test:coverage -w personalization-service
```

---

### Frontend

**Test Location:** `frontend/src/__tests__/` (if exists)

**Test Strategy:**
- Component testing
- Integration testing
- Build verification

**Run Commands:**
```bash
cd frontend
npm test
npm run build  # Verifies production build
```

---

## Test Execution Strategies

### 1. Local Development

**Individual Service:**
```bash
npm test -w <service-name>
npm run test:watch -w <service-name>  # Watch mode
npm run test:coverage -w <service-name>
```

**All Services:**
```bash
npm run test              # Run all tests
npm run test:all          # Comprehensive test run
npm run test:coverage     # All with coverage
```

**Specific Test File:**
```bash
cd <service-directory>
npm test -- <test-file-name>
```

---

### 2. CI/CD Execution

**Automated on:**
- Every push to any branch
- Every pull request
- Manual workflow dispatch

**Execution Order:**
1. Lint all services (quality gate)
2. Parallel test execution:
   - User Service
   - Exchange Connections Service
   - Market Data Service
   - Personalization Service
   - Alerts Service
   - Frontend
   - E2E Tests

**Database Setup (CI):**
```bash
# PostgreSQL 14 Docker container
# Health checks enabled
# Schema loaded from db/schema.sql
# Seed data from db/seed.sql (optional)
```

---

### 3. Pre-commit Testing

**Git Hooks:** Setup via `scripts/setup-git-hooks.js`

**Automatic Checks:**
- Linting on staged files
- Unit tests for affected services (optional)
- Format validation

**Setup:**
```bash
npm install  # Triggers postinstall hook
```

---

## Coverage Requirements

### Coverage Collection

**Paths Covered:**
- `controllers/**/*.js`
- `services/**/*.js`
- `models/**/*.js`
- `routes/**/*.js`

**Paths Excluded:**
- `node_modules/**`
- `coverage/**`
- `__tests__/**`

### Coverage Formats

1. **LCOV** (`lcov.info`) - CI integration
2. **HTML** (`lcov-report/`) - Developer viewing
3. **Clover** (`clover.xml`) - Tool integration
4. **JSON** (`coverage-final.json`) - Programmatic access

### Viewing Coverage

**Local:**
```bash
npm run test:coverage -w <service-name>
open <service-name>/coverage/lcov-report/index.html
```

**CI:**
- Coverage artifacts uploaded to GitHub Actions
- Available for 90 days
- Downloaded from workflow run page

---

## Test Data Management

### Database Schema

**Location:** `db/schema.sql`

**Contents:**
- Users table
- Portfolios table
- Transactions table
- Exchange connections table
- Alerts table
- Favorites table
- Indexes and constraints

### Seed Data

**Location:** `db/seed.sql`

**Purpose:**
- Test users
- Sample portfolios
- Reference data
- Development data

**Loading:**
```bash
# CI/CD automatic
psql -h localhost -U postgres -d dacpt -f db/schema.sql
psql -h localhost -U postgres -d dacpt -f db/seed.sql
```

---

## Mocking Strategies

### External API Mocking

**Market Data APIs:**
- CoinMarketCap API mocked in tests
- Predictable response fixtures
- Error scenario simulation

**Example:**
```javascript
jest.mock('axios');
axios.get.mockResolvedValue({ data: mockResponse });
```

### Database Mocking

**User Service:**
- Uses `pg-mem` for in-memory database
- No external PostgreSQL needed
- Fast test execution

**Other Services:**
- Real PostgreSQL in CI
- Transaction rollback after tests
- Isolated test environments

### Service-to-Service Mocking

**Pattern:**
```javascript
jest.mock('../services/externalService');
externalService.fetchData.mockResolvedValue(testData);
```

---

## Test Environment Configuration

### Environment Variables (Test)

```bash
NODE_ENV=test
JWT_SECRET=test-jwt-secret-key
PGHOST=localhost
PGPORT=5432
PGDATABASE=dacpt
PGUSER=postgres
PGPASSWORD=postgres
MARKET_DATA_SERVICE_URL=http://localhost:5001
```

### Service Ports (Development)

- User Service: Custom
- Exchange Connections Service: Custom
- Market Data Service: 5001
- Personalization Service: Custom
- Alerts Service: Custom

---

## Test Reporting

### Local Reports

**Generate:**
```bash
npm run reports  # Executes scripts/generate-local-reports.js
```

**Output Location:** `reports/`

**Report Structure:**
```
reports/
  lint/
    lint-report.txt
  user-service/
    coverage/
  exchange-connections-service/
    coverage/
  market-data-service/
    coverage/
  personalization-service/
    coverage/
  alerts-service/
    coverage/
  frontend/
    build/
    coverage/
```

### CI Reports

**Generated Automatically:**
- Test summaries in GitHub Step Summary
- Coverage reports as artifacts
- Lint reports with scoring

**Access:**
1. Navigate to GitHub Actions
2. Select workflow run
3. View "Summary" for overview
4. Download artifacts for details

---

## Common Test Patterns

### 1. Controller Testing

```javascript
describe('Controller', () => {
  it('should handle valid request', async () => {
    const res = await request(app)
      .post('/api/endpoint')
      .send({ data })
      .expect(200);
    
    expect(res.body).toMatchObject({ expected });
  });

  it('should handle invalid request', async () => {
    const res = await request(app)
      .post('/api/endpoint')
      .send({ invalid })
      .expect(400);
  });
});
```

### 2. Service Testing

```javascript
describe('Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process data correctly', async () => {
    const result = await service.process(input);
    expect(result).toBe(expected);
  });

  it('should handle errors', async () => {
    await expect(service.process(invalid))
      .rejects.toThrow('Expected error');
  });
});
```

### 3. Integration Testing

```javascript
describe('Integration', () => {
  beforeAll(async () => {
    // Setup database
    await loadSchema();
  });

  afterAll(async () => {
    // Cleanup
    await cleanupDatabase();
  });

  it('should complete workflow', async () => {
    // Multi-step test
    const step1 = await firstOperation();
    const step2 = await secondOperation(step1);
    expect(step2).toMatchSnapshot();
  });
});
```

---

## Debugging Tests

### Run Single Test

```bash
cd service-directory
npm test -- --testNamePattern="test name"
npm test -- path/to/test-file.js
```

### Verbose Output

```bash
npm test -- --verbose
npm test -- --detectOpenHandles  # Find async issues
```

### Debug Mode

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## Quality Metrics

### Current Coverage Targets

- Controllers: >80%
- Services: >75%
- Models: >70%
- Routes: >90%

### Test Reliability

- No flaky tests allowed
- Deterministic results
- Isolated test cases
- Proper cleanup

### Performance

- Unit tests: <5s per suite
- Integration tests: <30s per suite
- Full test suite: <2min per service

---

## Best Practices

1. **Test Isolation:** Each test should be independent
2. **Clear Naming:** Descriptive test names
3. **Arrange-Act-Assert:** Follow AAA pattern
4. **Mock External Deps:** Don't test third-party code
5. **Coverage Over Quantity:** Meaningful tests, not just high coverage
6. **Fast Execution:** Keep tests fast for quick feedback
7. **Cleanup:** Always cleanup after tests
8. **Deterministic:** Tests should produce same results every time

---

## Continuous Improvement

### Monitoring
- Track coverage trends
- Identify untested code paths
- Review test failures

### Maintenance
- Update tests with code changes
- Refactor test utilities
- Remove obsolete tests
- Add tests for bugs

### Documentation
- Comment complex test scenarios
- Document test data setup
- Explain mocking strategies
- Maintain test documentation
