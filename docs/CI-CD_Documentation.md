# CI/CD Pipeline Documentation

## Overview

The project uses GitHub Actions for continuous integration and deployment. The pipeline ensures code quality through linting, runs comprehensive tests, and generates coverage reports.

## Pipeline Structure

### Workflows

#### 1. CI-CD Pipeline (`.github/workflows/ci-cd.yml`)

**Triggers:**
- Push to any branch
- Pull requests to any branch

**Permissions:**
- `contents: read`
- `pull-requests: write`
- `issues: write`
- `actions: read`

**Node.js Version:** 20

---

## Pipeline Jobs

### 1. Lint All Services

**Purpose:** Enforce code quality standards across all services

**Steps:**
1. Checkout code
2. Setup Node.js 20 with npm cache
3. Install root dependencies (`npm ci`)
4. Install workspace dependencies (`npm ci --workspaces`)
5. Run global lint check (`npm run lint`)
6. Parse lint results (score, errors, warnings)
7. Create lint summary in GitHub step summary
8. Save lint report to `reports/lint/`
9. Upload lint report as artifact (30-day retention)
10. Comment PR with lint results (if applicable)
11. **Fail if score below 7.5/10**

**Scoring System:**
- 10.0: PERFECT
- 9.0-9.9: EXCELLENT
- 7.0-8.9: GOOD
- 5.0-6.9: FAIR
- <5.0: NEEDS IMPROVEMENT

**Quality Gate:** Minimum score 7.5/10 required to pass

**Artifacts:**
- Lint report (`lint-output.txt`)
- Reports directory (`reports/lint/`)

---

### 2. User Service Tests

**Depends on:** `lint-all-services`

**Database:** PostgreSQL 14 (Docker container)
- User: `postgres`
- Password: `postgres`
- Database: `dacpt`
- Health checks enabled

**Steps:**
1. Setup Node.js environment
2. Install dependencies
3. Install PostgreSQL client
4. Wait for database (30 attempts, 2s intervals)
5. Load database schema (`db/schema.sql`)
6. Load seed data (`db/seed.sql`) if exists
7. Run tests with coverage
8. Generate test summary
9. Save results to `reports/user-service/`
10. Upload coverage artifacts

**Environment Variables:**
```
PGHOST=localhost
PGPORT=<dynamic>
PGDATABASE=dacpt
PGUSER=postgres
PGPASSWORD=postgres
NODE_ENV=test
JWT_SECRET=test-jwt-secret-key
```

**Artifacts:**
- Coverage reports
- Test results

---

### 3. Exchange Connections Service Tests

**Depends on:** `lint-all-services`

**Database:** PostgreSQL 14 (same as User Service)

**Steps:** Same pattern as User Service
- Schema and seed loading
- Test execution with coverage
- Report generation and upload

**Artifacts:**
- Coverage reports (`exchange-connections-service/coverage`)
- Reports directory (`reports/exchange-connections-service/`)

---

### 4. Market Data Service Tests

**Depends on:** `lint-all-services`

**Database:** PostgreSQL 14

**Steps:** Same pattern as other services
- Environment setup
- Database initialization
- Test execution
- Coverage reporting

**Artifacts:**
- Coverage reports
- Test results in `reports/market-data-service/`

---

### 5. Personalization Service Tests

**Depends on:** `lint-all-services`

**Database:** PostgreSQL 14

**Steps:** Standard service test pattern

**Artifacts:**
- Coverage reports
- Service-specific test results

---

### 6. Alerts Service Tests

**Depends on:** `lint-all-services`

**Database:** PostgreSQL 14

**Test Pattern:**
- Load schema and seed data
- Run tests with coverage
- Generate summary
- Upload artifacts

**Artifacts:**
- Coverage reports (`alerts-service/coverage`)
- Reports in `reports/alerts-service/`

---

### 7. Frontend Build & Test

**Depends on:** `lint-all-services`

**No database required**

**Steps:**
1. Setup Node.js 20
2. Install frontend dependencies
3. Run frontend linting
4. Run tests (if test script exists)
5. Build production bundle (`npm run build`)
6. Save build artifacts to `reports/frontend/`
7. Upload artifacts

**Artifacts:**
- Production build (`frontend/dist`)
- Frontend coverage (if available)
- Build reports

---

### 8. End-to-End Integration Tests

**Depends on:** `lint-all-services`

**Database:** PostgreSQL 14

**Purpose:** Test cross-service integration and full system workflows

**Steps:**
1. Setup complete environment
2. Start all services
3. Load database schema
4. Run E2E test suite
5. Generate integration test reports

**Artifacts:**
- E2E test results
- Integration coverage

---

## Additional Workflow: Run Tests (`.github/workflows/run-tests.yml`)

**Trigger:** Manual dispatch (workflow_dispatch)

**Purpose:** On-demand test execution for specific services

**Inputs:**
- `service`: Choose service or "all" (required)
  - Options: all, user-service, exchange-connections-service, market-data-service, personalization-service, alerts-service, frontend
- `coverage`: Generate coverage report (boolean, default: true)

**Database:** PostgreSQL 14 (same configuration)

**Workflow:**
1. User selects service to test
2. Setup environment
3. Initialize database
4. Run selected service tests
5. Generate coverage if enabled
6. Upload results

---

## Artifact Management

### Retention Policies
- Lint reports: 30 days
- Coverage reports: Default (90 days)
- Build artifacts: Default

### Artifact Types
1. **Lint Reports:**
   - `lint-output.txt`
   - `reports/lint/lint-report.txt`

2. **Service Coverage:**
   - `<service>/coverage/` (clover.xml, lcov.info, html reports)
   - `reports/<service>/` (organized reports)

3. **Frontend Build:**
   - `frontend/dist/` (production bundle)
   - `reports/frontend/build/` (build artifacts)

---

## Environment Configuration

### Secrets Required
- `GITHUB_TOKEN` (auto-provided)

### Environment Variables (Test)
```bash
PGHOST=localhost
PGPORT=<dynamically assigned>
PGDATABASE=dacpt
PGUSER=postgres
PGPASSWORD=postgres
NODE_ENV=test
JWT_SECRET=test-jwt-secret-key
```

---

## Quality Gates

### 1. Linting
- **Threshold:** 7.5/10 minimum score
- **Blocks:** Pipeline fails if below threshold
- **Metrics:** Total errors, warnings, score

### 2. Tests
- All tests must pass
- Coverage reports generated
- No critical failures allowed

### 3. Build
- Frontend build must succeed
- No build errors
- Bundle optimization verified

---

## Parallel Execution

The pipeline runs service tests in parallel after linting:
```
lint-all-services
    ├─ user-service (parallel)
    ├─ exchange-connections-service (parallel)
    ├─ market-data-service (parallel)
    ├─ personalization-service (parallel)
    ├─ alerts-service (parallel)
    ├─ frontend (parallel)
    └─ e2e-tests (parallel)
```

**Benefit:** Reduced total pipeline time from ~30min to ~8-10min

---

## PR Integration

### Automated PR Comments

When running on pull requests, the pipeline automatically comments with:

**Lint Results:**
```
## Lint Results

### Overall Score: [EXCELLENT] 9.2/10 - EXCELLENT

| Metric | Count | Status |
|--------|-------|---------|
| Errors | 0 | PASS |
| Warnings | 3 | WARN |

<details>
<summary>View Detailed Lint Output</summary>
...
</details>
```

**Test Results:**
- Individual service test summaries
- Coverage percentages
- Failed test details

---

## Local Development

### Run Linting Locally
```bash
npm run lint              # Check all services
npm run lint:fix          # Auto-fix issues
npm run lint:score        # Get score only
```

### Run Tests Locally
```bash
npm run test              # Run all tests
npm run test:all          # Run with reports
npm run test:coverage     # Generate coverage
```

### Generate Reports
```bash
npm run reports           # Generate local reports
```

---

## Monitoring & Debugging

### View Pipeline Status
- GitHub Actions tab in repository
- Commit status checks
- PR checks panel

### Access Artifacts
1. Go to Actions tab
2. Select workflow run
3. Scroll to "Artifacts" section
4. Download desired artifacts

### Debug Failed Jobs
1. Click on failed job
2. Expand failed step
3. View logs and error messages
4. Check artifacts for detailed reports

---

## Future Enhancements

1. **Deployment Stage:**
   - Automatic deployment to staging
   - Production deployment with approval

2. **Performance Testing:**
   - Load testing integration
   - Performance regression detection

3. **Security Scanning:**
   - Dependency vulnerability checks
   - Code security analysis

4. **Notifications:**
   - Slack/Discord integration
   - Email notifications for failures

5. **Caching:**
   - Enhanced npm cache strategy
   - Docker layer caching
