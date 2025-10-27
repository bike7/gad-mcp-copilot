# Users API - k6 Performance Test Plan

## Overview

This performance test plan outlines comprehensive test scenarios for the Users API endpoints of the 🦎 GAD application. The tests will be implemented using k6 with TypeScript to evaluate the API's behavior under various load conditions.

**Base URL**: `http://localhost:3000/api`

**Target Endpoints**: All endpoints under the `/users` resource

---

## Application Context

The 🦎 GAD application provides a RESTful API for user management with the following core endpoints:

- **GET /users** - Retrieve list of all users
- **POST /users** - Create a new user
- **GET /users/{id}** - Retrieve a specific user by ID
- **PUT /users/{id}** - Update an entire user record (requires authentication)
- **PATCH /users/{id}** - Partially update a user record (requires authentication)
- **DELETE /users/{id}** - Delete a user (requires authentication)
- **HEAD /users/{id}** - Retrieve user metadata without body
- **GET /users/search** - Search users with query parameters

---

## Test Objectives

1. **Baseline Performance**: Establish performance benchmarks for each endpoint under normal load
2. **Scalability**: Determine how the API handles increasing load (load testing)
3. **Limits**: Identify breaking points and maximum capacity (stress testing)
4. **Endurance**: Verify stability over extended periods (soak testing)
5. **Burst Handling**: Test response to sudden traffic spikes (spike testing)
6. **Bottlenecks**: Identify performance bottlenecks and resource constraints

---

## Test Scenarios

### 1. Smoke Test - API Health Check

**Seed:** N/A (Fresh database state)

#### 1.1 Verify All Endpoints Are Accessible

**Objective**: Confirm all user endpoints respond successfully with minimal load

**Test Configuration**:

- Virtual Users (VUs): 1
- Duration: 30 seconds
- Iterations: 1 per endpoint

**Steps**:

1. Send GET request to `/api/users`
2. Send GET request to `/api/users/1` (assuming user ID 1 exists)
3. Send HEAD request to `/api/users/1`
4. Send GET request to `/api/users/search?email=test`

**Expected Results**:

- All GET requests return HTTP 200
- HEAD request returns HTTP 200 with no body
- Response times < 500ms for each endpoint
- No errors or failures
- Response bodies contain valid JSON (where applicable)

**Success Criteria**:

- 100% success rate
- p95 response time < 500ms
- No HTTP 5xx errors

---

### 2. Load Test - Normal Traffic Simulation

**Seed:** Pre-populated database with 1000 users

#### 2.1 Read-Heavy Workload

**Objective**: Simulate typical user browsing behavior with high read operations

**Test Configuration**:

- Virtual Users (VUs): 50
- Duration: 5 minutes
- Ramp-up: 30 seconds

**Request Distribution**:

- 70% - GET /users (list all users)
- 20% - GET /users/{id} (random user IDs)
- 10% - GET /users/search?firstname={name}

**Steps**:

1. Start with 1 VU
2. Gradually increase to 50 VUs over 30 seconds
3. Maintain 50 VUs for 4 minutes
4. Ramp down over 30 seconds

**Expected Results**:

- HTTP 200 for all GET requests
- p95 response time < 1000ms
- p99 response time < 2000ms
- Throughput: > 500 requests/second
- Error rate: < 1%

**Success Criteria**:

- 99% success rate
- Average response time < 500ms
- No connection errors
- Stable memory usage on server

#### 2.2 Write-Heavy Workload

**Objective**: Test API under user registration and update scenarios

**Test Configuration**:

- Virtual Users (VUs): 20
- Duration: 3 minutes
- Ramp-up: 30 seconds

**Request Distribution**:

- 40% - POST /users (create new users)
- 30% - PATCH /users/{id} (update existing users)
- 20% - GET /users/{id} (verify updates)
- 10% - DELETE /users/{id} (cleanup)

**Steps**:

1. Authenticate users (POST /login to get auth tokens)
2. Create new users with unique email addresses
3. Update user information (firstname, lastname)
4. Verify updates were successful
5. Delete test users for cleanup

**Expected Results**:

- HTTP 201 for POST requests
- HTTP 200 for PATCH, GET requests
- HTTP 204 or 200 for DELETE requests
- p95 response time < 1500ms
- No duplicate user creation errors (unique email constraint)

**Success Criteria**:

- 98% success rate (accounting for intentional constraint violations)
- Data integrity maintained (no corrupted records)
- Proper authentication handling
- Transactions complete successfully

#### 2.3 Mixed Workload - Realistic Usage

**Objective**: Simulate real-world usage patterns with mixed operations

**Test Configuration**:

- Virtual Users (VUs): 100
- Duration: 10 minutes
- Ramp-up: 1 minute

**Request Distribution**:

- 50% - GET /users (browsing)
- 25% - GET /users/{id} (profile views)
- 10% - POST /users (new registrations)
- 8% - PATCH /users/{id} (profile updates)
- 5% - GET /users/search (search operations)
- 2% - DELETE /users/{id} (account deletions)

**Steps**:

1. Initialize test data (100 existing users)
2. Ramp up to 100 concurrent VUs
3. Execute mixed operations based on distribution
4. Track response times per endpoint
5. Monitor database performance

**Expected Results**:

- Overall success rate > 99%
- p95 response time < 1000ms per endpoint type
- Throughput > 800 requests/second
- Database connection pool remains stable
- No memory leaks

**Success Criteria**:

- Average response time < 600ms
- Error rate < 0.5%
- CPU usage < 80%
- Database connections < max pool size

---

### 3. Stress Test - Beyond Normal Capacity

**Seed:** Pre-populated database with 5000 users

#### 3.1 Gradual Load Increase

**Objective**: Identify breaking point and maximum capacity

**Test Configuration**:

- Virtual Users (VUs): Start at 100, increase to 500
- Duration: 15 minutes
- Ramp-up stages: 100, 200, 300, 400, 500 VUs

**Steps**:

1. Start with 100 VUs for 3 minutes
2. Increase to 200 VUs for 3 minutes
3. Increase to 300 VUs for 3 minutes
4. Increase to 400 VUs for 3 minutes
5. Increase to 500 VUs for 3 minutes
6. Monitor when degradation begins

**Expected Results**:

- Identify the VU count where p95 exceeds 2000ms
- Determine error rate threshold
- Find maximum sustainable throughput
- Observe graceful degradation (not sudden failure)

**Success Criteria**:

- API remains responsive (no complete failures) up to at least 300 VUs
- Error messages are meaningful (not 500 errors)
- System recovers after load reduction
- No data corruption

#### 3.2 Database Connection Stress

**Objective**: Test database connection pool limits

**Test Configuration**:

- Virtual Users (VUs): 200
- Duration: 5 minutes
- Focus: Concurrent database operations

**Request Distribution**:

- 100% - Database-intensive operations (GET /users with search filters)

**Steps**:

1. Execute complex search queries simultaneously
2. Monitor database connection pool utilization
3. Track connection timeout errors
4. Measure query execution times

**Expected Results**:

- Identify connection pool saturation point
- Measure connection wait times
- Detect connection leaks
- Observe connection pool behavior under stress

**Success Criteria**:

- Connection pool doesn't exhaust before 150 concurrent requests
- No connection leaks detected
- Graceful handling of connection exhaustion
- Recovery after stress period

---

### 4. Spike Test - Sudden Traffic Surges

**Seed:** Pre-populated database with 2000 users

#### 4.1 Sudden Traffic Spike

**Objective**: Test system behavior during sudden traffic increases (e.g., product launch, viral content)

**Test Configuration**:

- Virtual Users (VUs): 10 → 300 → 10
- Duration: 10 minutes
- Spike pattern: Sudden increase and decrease

**Steps**:

1. Start with 10 VUs for 2 minutes (baseline)
2. Instantly increase to 300 VUs and maintain for 3 minutes
3. Instantly drop back to 10 VUs for 5 minutes (recovery)
4. Monitor response times and error rates during spike
5. Observe recovery time

**Expected Results**:

- System handles spike without crashing
- Temporary performance degradation is acceptable
- p95 response time < 3000ms during spike
- System fully recovers within 1 minute after spike ends
- No permanent system damage

**Success Criteria**:

- Zero downtime
- Error rate during spike < 5%
- Full recovery to baseline performance after spike
- No lingering performance issues
- Queue mechanisms work properly (if implemented)

#### 4.2 Repeated Spikes

**Objective**: Test system resilience to multiple consecutive spikes

**Test Configuration**:

- Virtual Users (VUs): Oscillating between 20 and 200
- Duration: 15 minutes
- Pattern: 3 spike cycles

**Steps**:

1. Baseline: 20 VUs for 2 minutes
2. Spike 1: Jump to 200 VUs for 2 minutes
3. Recovery: Drop to 20 VUs for 2 minutes
4. Spike 2: Jump to 200 VUs for 2 minutes
5. Recovery: Drop to 20 VUs for 2 minutes
6. Spike 3: Jump to 200 VUs for 2 minutes
7. Final recovery: Drop to 20 VUs for 3 minutes

**Expected Results**:

- System handles all three spikes
- Performance doesn't degrade with each spike
- Recovery time remains consistent
- No cumulative memory leaks

**Success Criteria**:

- Consistent performance across all spikes
- Recovery time < 1 minute after each spike
- No resource exhaustion
- Error rate < 3% during spikes

---

### 5. Soak Test - Extended Load Duration

**Seed:** Pre-populated database with 3000 users

#### 5.1 Extended Normal Load

**Objective**: Identify memory leaks, resource exhaustion, and stability issues over time

**Test Configuration**:

- Virtual Users (VUs): 75
- Duration: 4 hours
- Constant load

**Request Distribution**:

- 60% - GET /users
- 20% - GET /users/{id}
- 10% - POST /users
- 5% - PATCH /users/{id}
- 5% - DELETE /users/{id}

**Steps**:

1. Ramp up to 75 VUs over 5 minutes
2. Maintain constant 75 VUs for 4 hours
3. Monitor system metrics continuously
4. Track resource utilization trends
5. Check for gradual performance degradation

**Expected Results**:

- Consistent response times throughout test
- No memory leaks (stable memory usage)
- No connection pool leaks
- No gradual performance degradation
- Error rate remains < 0.5%

**Success Criteria**:

- p95 response time deviation < 20% from start to end
- Memory usage remains stable (< 10% growth)
- No crashes or restarts required
- Database performance remains stable
- Log files don't show recurring errors

**Monitoring Points** (check every 15 minutes):

- Average response time
- p95 and p99 response times
- Error rate
- Memory usage (heap and RSS)
- CPU usage
- Database connection count
- Open file handles
- Thread count

---

### 6. Breakpoint Test - Finding System Limits

**Seed:** Pre-populated database with 10,000 users

#### 6.1 Incremental Load Until Failure

**Objective**: Determine absolute maximum capacity before system failure

**Test Configuration**:

- Virtual Users (VUs): Start at 50, increase by 50 every 2 minutes
- Duration: Until failure or 1000 VUs reached
- Aggressive ramp-up

**Steps**:

1. Start with 50 VUs
2. Every 2 minutes, add 50 more VUs
3. Continue until:
   - Error rate exceeds 50%
   - p95 response time exceeds 10 seconds
   - System becomes unresponsive
   - 1000 VUs reached
4. Document the breaking point

**Expected Results**:

- Identify exact VU count where system breaks
- Determine whether failure is graceful or catastrophic
- Understand failure modes (timeouts, errors, crashes)

**Success Criteria**:

- System can handle at least 400 VUs
- Failure is graceful (proper error responses, not crashes)
- System can recover after load removal
- Clear failure indicators (metrics, logs)

---

### 7. Authentication & Authorization Performance

**Seed:** Pre-populated database with 500 users with login credentials

#### 7.1 Token Generation Load

**Objective**: Test authentication endpoint performance

**Test Configuration**:

- Virtual Users (VUs): 100
- Duration: 5 minutes
- Focus: POST /login endpoint

**Steps**:

1. Prepare valid user credentials
2. Send concurrent login requests
3. Measure token generation time
4. Track authentication success rate

**Expected Results**:

- p95 response time < 800ms for login
- 100% success rate for valid credentials
- Tokens are valid and properly formatted
- No token collisions

**Success Criteria**:

- Login throughput > 200 requests/second
- Token generation is consistent
- No security vulnerabilities exposed under load
- Rate limiting works as expected (if implemented)

#### 7.2 Authenticated Request Performance

**Objective**: Measure overhead of authentication on protected endpoints

**Test Configuration**:

- Virtual Users (VUs): 75
- Duration: 5 minutes
- Compare authenticated vs. non-authenticated endpoints

**Request Distribution**:

- 50% - PATCH /users/{id} (authenticated)
- 50% - GET /users/{id} (non-authenticated)

**Steps**:

1. Obtain auth tokens for users
2. Execute authenticated and non-authenticated requests
3. Compare response times
4. Measure token validation overhead

**Expected Results**:

- Authentication overhead < 50ms per request
- Token validation doesn't become bottleneck
- Proper 401 responses for missing/invalid tokens
- No token expiration issues during test

**Success Criteria**:

- Authenticated requests have < 10% slower response time vs. non-authenticated
- 100% accurate authorization (no false positives/negatives)
- Session management is stable

---

### 8. Data Volume Tests

**Seed:** Databases with varying record counts

#### 8.1 Large Dataset Retrieval

**Objective**: Test performance with large result sets

**Test Configurations**:

- Test A: Database with 10,000 users
- Test B: Database with 50,000 users
- Test C: Database with 100,000 users

**Test Parameters**:

- Virtual Users (VUs): 50
- Duration: 3 minutes per test
- Focus: GET /users endpoint

**Steps**:

1. Execute test A with 10K users
2. Execute test B with 50K users
3. Execute test C with 100K users
4. Compare response times and throughput

**Expected Results**:

- Response time increases proportionally with data size
- Pagination works efficiently (if implemented)
- No timeouts or memory errors
- Database query performance tracked

**Success Criteria**:

- GET /users with 100K records completes in < 5 seconds
- Response time scaling is sub-linear (not exponential)
- Server memory remains stable
- Database indexes are effective

#### 8.2 Search Performance with Large Dataset

**Objective**: Test search functionality with large datasets

**Test Configuration**:

- Virtual Users (VUs): 50
- Duration: 5 minutes
- Database: 50,000 users

**Steps**:

1. Execute searches by firstname (common search)
2. Execute searches by lastname (common search)
3. Execute searches by email (exact match)
4. Execute searches with multiple filters
5. Test wildcard searches

**Expected Results**:

- Indexed searches (email) are fast (< 100ms)
- Full-text searches complete in < 1 second
- Wildcard searches don't cause timeouts
- Search results are accurate

**Success Criteria**:

- p95 for email search < 200ms
- p95 for name search < 1000ms
- No full table scans observed
- Search query efficiency validated

---

### 9. Concurrent Operations Test

**Seed:** Pre-populated database with 1000 users

#### 9.1 Concurrent Updates to Same Resource

**Objective**: Test handling of concurrent modifications (race conditions)

**Test Configuration**:

- Virtual Users (VUs): 10
- Duration: 2 minutes
- Focus: Multiple VUs updating the same user records

**Steps**:

1. Select 10 user IDs for testing
2. Have 10 VUs simultaneously attempt to update the same users
3. Track update conflicts
4. Verify data consistency after test

**Expected Results**:

- Proper concurrency control (optimistic or pessimistic locking)
- No lost updates
- Appropriate error responses for conflicts (409 Conflict)
- Data integrity maintained

**Success Criteria**:

- Zero data corruption
- Last write wins or proper conflict resolution
- Transaction isolation works correctly
- Audit logs show all attempts (if implemented)

#### 9.2 Concurrent Create Operations

**Objective**: Test unique constraint handling under concurrent load

**Test Configuration**:

- Virtual Users (VUs): 50
- Duration: 3 minutes
- Focus: Creating users with potentially duplicate emails

**Steps**:

1. Attempt to create users with the same email simultaneously
2. Verify only one succeeds
3. Test unique email constraint under load
4. Measure constraint validation performance

**Expected Results**:

- Only one user created per unique email
- Proper 409 or 422 errors for duplicates
- Constraint checks don't cause deadlocks
- Fast constraint validation (< 50ms overhead)

**Success Criteria**:

- 100% enforcement of unique constraints
- No duplicate records in database
- Clear error messages for duplicates
- No database deadlocks

---

### 10. Endpoint-Specific Scenarios

#### 10.1 GET /users - List Performance

**Objective**: Optimize and validate user listing performance

**Test Configuration**:

- Virtual Users (VUs): 100
- Duration: 3 minutes

**Test Variations**:

1. Default pagination (page 1)
2. Middle pages (page 50)
3. Last pages (page N)
4. Different page sizes (10, 50, 100 items)

**Expected Results**:

- Pagination improves performance vs. no pagination
- Page position doesn't significantly impact performance
- Larger page sizes increase response time proportionally
- Total count is efficient (if provided)

**Success Criteria**:

- p95 < 500ms for paginated requests (50 items/page)
- Consistent performance across page numbers
- Efficient count queries (< 100ms)

#### 10.2 POST /users - Create Performance

**Objective**: Validate user creation performance and error handling

**Test Configuration**:

- Virtual Users (VUs): 50
- Duration: 3 minutes

**Test Variations**:

1. Valid user data (happy path)
2. Invalid email formats (validation errors)
3. Missing required fields (validation errors)
4. Duplicate emails (conflict errors)
5. Very long field values (boundary testing)

**Expected Results**:

- Valid creations: < 500ms
- Validation errors returned quickly (< 100ms)
- Proper HTTP status codes (201, 400, 409, 422)
- Clear error messages

**Success Criteria**:

- 100% data validation accuracy
- No invalid data persisted
- Transaction rollback works for failures
- Rate of successful creations > 100/second

#### 10.3 GET /users/{id} - Single User Retrieval

**Objective**: Test individual user fetch performance

**Test Configuration**:

- Virtual Users (VUs): 100
- Duration: 5 minutes

**Test Variations**:

1. Existing user IDs (200 responses)
2. Non-existent user IDs (404 responses)
3. Invalid ID formats (400 responses)
4. Sequential vs. random ID access patterns

**Expected Results**:

- Existing users: p95 < 200ms
- 404 responses: p95 < 100ms (no unnecessary DB queries)
- Cache effectiveness (if implemented)
- Database index usage confirmed

**Success Criteria**:

- Consistent response times regardless of ID
- Proper error handling for invalid IDs
- Cache hit rate > 80% (if caching implemented)
- No N+1 query problems

#### 10.4 PATCH /users/{id} - Partial Update Performance

**Objective**: Test partial update efficiency

**Test Configuration**:

- Virtual Users (VUs): 30
- Duration: 3 minutes

**Test Variations**:

1. Update single field (firstname)
2. Update multiple fields (firstname, lastname, avatar)
3. No actual changes (idempotent updates)
4. Invalid field values (validation errors)

**Expected Results**:

- Update response time < 800ms
- Only modified fields updated in database
- Validation runs efficiently
- Audit trail recorded (if implemented)

**Success Criteria**:

- Selective field updates work correctly
- Idempotent updates don't cause errors
- Version conflicts detected (if using optimistic locking)
- No unnecessary database writes

#### 10.5 DELETE /users/{id} - Deletion Performance

**Objective**: Test user deletion and cleanup performance

**Test Configuration**:

- Virtual Users (VUs): 20
- Duration: 2 minutes

**Test Variations**:

1. Delete existing users (successful deletions)
2. Delete non-existent users (404 errors)
3. Delete already-deleted users (idempotent)
4. Cascading deletes (if user has related data)

**Expected Results**:

- Deletion response time < 1000ms
- Proper cleanup of related data
- Referential integrity maintained
- 404 for non-existent users

**Success Criteria**:

- Complete data removal confirmed
- No orphaned records in database
- Cascade deletes work correctly
- Soft delete vs. hard delete implemented correctly (if applicable)

#### 10.6 HEAD /users/{id} - Metadata Performance

**Objective**: Validate HEAD request efficiency

**Test Configuration**:

- Virtual Users (VUs): 50
- Duration: 2 minutes

**Expected Results**:

- HEAD requests faster than GET (no body serialization)
- Proper headers returned (Content-Length, Content-Type)
- Same status codes as GET (200, 404)
- p95 < 100ms

**Success Criteria**:

- HEAD request = GET request - response body
- No body transmitted (Content-Length only)
- Efficient existence checks

#### 10.7 GET /users/search - Search Performance

**Objective**: Test search functionality under various conditions

**Test Configuration**:

- Virtual Users (VUs): 75
- Duration: 5 minutes

**Test Variations**:

1. Search by firstname (common field)
2. Search by lastname (common field)
3. Search by email (unique field, indexed)
4. Combined search (firstname + lastname)
5. Wildcard searches (starts with, contains)
6. Empty result searches
7. Large result set searches (hundreds of matches)

**Expected Results**:

- Email search: p95 < 200ms
- Name search: p95 < 800ms
- Combined search: p95 < 1000ms
- Empty results return quickly (< 100ms)

**Success Criteria**:

- All searches use database indexes
- No full table scans
- Pagination works with search
- Search accuracy: 100%

---

## Performance Metrics & Thresholds

### Key Performance Indicators (KPIs)

#### Response Time Targets

| Endpoint           | p50   | p95   | p99    | Max Acceptable |
| ------------------ | ----- | ----- | ------ | -------------- |
| GET /users         | 200ms | 500ms | 1000ms | 2000ms         |
| GET /users/{id}    | 100ms | 200ms | 500ms  | 1000ms         |
| POST /users        | 300ms | 600ms | 1000ms | 2000ms         |
| PATCH /users/{id}  | 250ms | 600ms | 1000ms | 2000ms         |
| DELETE /users/{id} | 200ms | 500ms | 1000ms | 2000ms         |
| HEAD /users/{id}   | 50ms  | 100ms | 200ms  | 500ms          |
| GET /users/search  | 300ms | 800ms | 1500ms | 3000ms         |
| POST /login        | 200ms | 500ms | 800ms  | 1500ms         |

#### Throughput Targets

- **Normal Load**: 500-1000 requests/second
- **Peak Load**: 300-500 requests/second with acceptable degradation
- **Stress Load**: System remains responsive (not unresponsive) up to 300+ VUs

#### Error Rate Thresholds

- **Normal Conditions**: < 0.1%
- **Load Test**: < 1%
- **Stress Test**: < 5%
- **Spike Test**: < 5% (during spike)

#### System Resource Limits

- **CPU Usage**: < 80% under normal load, < 95% under stress
- **Memory Usage**: < 80% of available RAM, < 5% growth per hour in soak tests
- **Database Connections**: < 80% of connection pool size
- **Disk I/O**: < 80% utilization
- **Network Bandwidth**: < 70% utilization

---

## Test Data Management

### Data Preparation

#### Seed Data Requirements

1. **Baseline Test Data**:
   - 1,000 users with unique emails
   - Variety of firstnames and lastnames (common names for realistic searches)
   - Valid password hashes
   - Mix of avatar URLs (some null, some valid URLs)

2. **Load Test Data**:
   - 5,000 pre-existing users
   - 100 users with authentication credentials (for authenticated endpoint testing)
   - Distributed creation dates (to test date-based queries)

3. **Stress Test Data**:
   - 10,000+ users
   - Realistic data distribution (not just sequential IDs)

#### Data Generation Strategy

```typescript
// Example user data factory
interface TestUser {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  avatar?: string;
}

function generateTestUser(index: number): TestUser {
  return {
    email: `testuser${index}_${Date.now()}@example.com`,
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    password: 'Test123!@#',
    avatar: index % 3 === 0 ? faker.image.avatar() : undefined,
  };
}
```

### Data Cleanup

- **During Test**: Use unique identifiers (timestamps, UUIDs) to avoid conflicts
- **After Test**: Delete all test data (emails matching pattern `testuser*@example.com`)
- **Failed Tests**: Ensure cleanup runs even on test failures
- **Database Reset**: Restore database to seed state between major test runs

---

## k6 Configuration

### Test Structure

```typescript
// performance-test.ts structure
import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
  scenarios: {
    smoke_test: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      tags: { test_type: 'smoke' },
    },
    load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 50 },
        { duration: '4m', target: 50 },
        { duration: '30s', target: 0 },
      ],
      tags: { test_type: 'load' },
    },
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 100,
      stages: [
        { duration: '3m', target: 100 },
        { duration: '3m', target: 200 },
        { duration: '3m', target: 300 },
        { duration: '3m', target: 400 },
        { duration: '3m', target: 500 },
      ],
      tags: { test_type: 'stress' },
    },
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '2m', target: 10 },
        { duration: '10s', target: 300 },
        { duration: '3m', target: 300 },
        { duration: '10s', target: 10 },
        { duration: '5m', target: 10 },
      ],
      tags: { test_type: 'spike' },
    },
    soak_test: {
      executor: 'constant-vus',
      vus: 75,
      duration: '4h',
      tags: { test_type: 'soak' },
    },
  },
  thresholds: {
    // Response time thresholds
    'http_req_duration{endpoint:get_users}': ['p(95)<500', 'p(99)<1000'],
    'http_req_duration{endpoint:get_user_by_id}': ['p(95)<200', 'p(99)<500'],
    'http_req_duration{endpoint:post_users}': ['p(95)<600', 'p(99)<1000'],
    'http_req_duration{endpoint:patch_user}': ['p(95)<600', 'p(99)<1000'],
    'http_req_duration{endpoint:delete_user}': ['p(95)<500', 'p(99)<1000'],

    // Error rate thresholds
    'http_req_failed{test_type:smoke}': ['rate<0.01'],
    'http_req_failed{test_type:load}': ['rate<0.01'],
    'http_req_failed{test_type:stress}': ['rate<0.05'],

    // Checks thresholds
    checks: ['rate>0.95'],
  },
};

export default function () {
  // Test logic here
}
```

### Execution Commands

```powershell
# Smoke Test
k6 run --out json=results/smoke-test-results.json tests/performance/smoke-test.ts

# Load Test
k6 run --out json=results/load-test-results.json tests/performance/load-test.ts

# Stress Test
k6 run --out json=results/stress-test-results.json tests/performance/stress-test.ts

# Spike Test
k6 run --out json=results/spike-test-results.json tests/performance/spike-test.ts

# Soak Test
k6 run --out json=results/soak-test-results.json tests/performance/soak-test.ts

# Run all tests sequentially
k6 run --out json=results/all-tests-results.json tests/performance/all-tests.ts
```

---

## Monitoring & Observability

### Application Metrics to Collect

1. **Response Times**:
   - Average, median, p95, p99, max
   - Per endpoint breakdown
   - Time series data

2. **Throughput**:
   - Requests per second (overall and per endpoint)
   - Data transfer rates (KB/s)

3. **Error Rates**:
   - HTTP 4xx errors (client errors)
   - HTTP 5xx errors (server errors)
   - Timeout errors
   - Connection errors

4. **System Resources**:
   - CPU usage (%)
   - Memory usage (MB and %)
   - Disk I/O (read/write MB/s)
   - Network I/O (MB/s)

5. **Database Metrics**:
   - Active connections
   - Connection wait time
   - Query execution time
   - Slow query log
   - Lock wait time
   - Transaction rollback rate

6. **Custom Metrics**:
   - Authentication token generation time
   - Token validation time
   - Validation error rate
   - Data integrity check results

### Tools & Dashboards

- **k6 Metrics**: Built-in k6 metrics and custom metrics
- **Grafana**: Real-time dashboard visualization
- **Prometheus**: Time-series metrics storage
- **Application Logs**: Centralized logging (e.g., ELK stack)
- **Database Monitoring**: Native database monitoring tools
- **APM Tools**: Application Performance Monitoring (e.g., New Relic, Datadog)

---

## Test Execution Schedule

### Development Phase

- **Daily**: Smoke tests (automated in CI/CD)
- **Before Major Changes**: Load tests
- **Weekly**: Full test suite (load + stress + spike)

### Pre-Release Phase

- **Regression**: Full test suite
- **Soak Test**: Run over weekend (48+ hours)
- **Breakpoint Test**: Establish new baseline

### Production Monitoring

- **Continuous**: Basic health checks
- **Weekly**: Capacity planning load tests
- **Monthly**: Full performance audit

---

## Success Criteria Summary

### Must Pass

1. ✅ Smoke test: 100% success rate
2. ✅ Load test: p95 < 1000ms, error rate < 1%
3. ✅ Stress test: System doesn't crash, error rate < 5%
4. ✅ No data corruption in any scenario
5. ✅ System recovers after stress/spike tests

### Should Pass

1. ✅ Soak test: No memory leaks over 4 hours
2. ✅ Spike test: System recovers in < 1 minute
3. ✅ Authentication performance: Login < 500ms (p95)
4. ✅ Search performance: Results in < 1000ms (p95)

### Nice to Have

1. ✅ Throughput > 1000 req/s under normal load
2. ✅ System handles 500+ VUs without crashing
3. ✅ Cache hit rate > 80% (if caching implemented)
4. ✅ Database query optimization (no full table scans)

---

## Reporting & Analysis

### Report Structure

1. **Executive Summary**
   - Overall test results (pass/fail)
   - Key findings and recommendations
   - Performance compared to targets

2. **Detailed Results**
   - Per-scenario breakdown
   - Response time distributions
   - Throughput analysis
   - Error analysis

3. **System Resource Analysis**
   - CPU, memory, disk, network trends
   - Database performance
   - Bottleneck identification

4. **Recommendations**
   - Performance optimization opportunities
   - Scalability improvements
   - Infrastructure recommendations

5. **Appendices**
   - Raw data files
   - Log excerpts
   - Configuration details

### Deliverables

- Test results JSON files (k6 output)
- Performance report (PDF/Markdown)
- Grafana dashboard screenshots
- Recommendations document
- Updated performance baseline

---

## Risk Mitigation

### Potential Issues

1. **Test Environment Different from Production**
   - **Mitigation**: Use production-like data volumes and configurations
   - **Mitigation**: Document environment differences

2. **Test Data Cleanup Failures**
   - **Mitigation**: Automated cleanup scripts with error handling
   - **Mitigation**: Isolated test database

3. **Test Interference**
   - **Mitigation**: Run tests in isolation (dedicated test environment)
   - **Mitigation**: Schedule tests to avoid concurrent runs

4. **Database State Corruption**
   - **Mitigation**: Database snapshots before each test
   - **Mitigation**: Rollback capabilities

5. **Network Variability**
   - **Mitigation**: Run tests from stable network environment
   - **Mitigation**: Multiple test runs to establish confidence intervals

---

## Appendix

### A. Sample Test Code Structure

```typescript
// users-performance-test.ts
import { check, group, sleep } from 'k6';
import http from 'k6/http';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const getUsersRate = new Rate('get_users_success');
const getUserByIdDuration = new Trend('get_user_by_id_duration');

const BASE_URL = 'http://localhost:3000/api';

export default function () {
  group('GET /users - List all users', () => {
    const res = http.get(`${BASE_URL}/users`, {
      tags: { endpoint: 'get_users' },
    });

    const success = check(res, {
      'status is 200': (r) => r.status === 200,
      'response has users array': (r) =>
        JSON.parse(r.body).hasOwnProperty('data'),
      'response time < 500ms': (r) => r.timings.duration < 500,
    });

    getUsersRate.add(success);
  });

  group('GET /users/{id} - Get single user', () => {
    const userId = Math.floor(Math.random() * 1000) + 1;
    const res = http.get(`${BASE_URL}/users/${userId}`, {
      tags: { endpoint: 'get_user_by_id' },
    });

    check(res, {
      'status is 200 or 404': (r) => [200, 404].includes(r.status),
      'response time < 200ms': (r) => r.timings.duration < 200,
    });

    getUserByIdDuration.add(res.timings.duration);
  });

  sleep(1);
}
```

### B. Authentication Helper

```typescript
// auth-helper.ts
import http from 'k6/http';

export function authenticate(email: string, password: string): string {
  const payload = JSON.stringify({
    email: email,
    password: password,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(`${BASE_URL}/login`, payload, params);
  const token = JSON.parse(res.body).token;

  return token;
}

export function getAuthHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
}
```

### C. Test Data Generator

```typescript
// test-data-generator.ts
export function generateUser(index: number) {
  const timestamp = Date.now();
  return {
    email: `testuser${index}_${timestamp}@example.com`,
    firstname: getRandomFirstName(),
    lastname: getRandomLastName(),
    password: 'Test123!@#',
  };
}

const firstnames = [
  'John',
  'Jane',
  'Michael',
  'Sarah',
  'David',
  'Emily',
  'Chris',
  'Anna',
];
const lastnames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
];

function getRandomFirstName(): string {
  return firstnames[Math.floor(Math.random() * firstnames.length)];
}

function getRandomLastName(): string {
  return lastnames[Math.floor(Math.random() * lastnames.length)];
}
```

### D. Glossary

- **VU (Virtual User)**: Simulated user executing test scenarios
- **RPS (Requests Per Second)**: Throughput measurement
- **p50, p95, p99**: Percentile response times (50th, 95th, 99th percentile)
- **Throughput**: Number of requests processed per unit time
- **Latency**: Time between request sent and response received
- **Response Time**: Total time for request/response cycle
- **Ramp-up**: Gradual increase in load
- **Ramp-down**: Gradual decrease in load
- **Soak Test**: Extended duration test to find stability issues
- **Spike Test**: Sudden load increase test
- **Stress Test**: Beyond-capacity load test
- **Breakpoint Test**: Finding maximum capacity before failure

---

## Document Control

**Version**: 1.0  
**Date**: October 27, 2025  
**Author**: Performance Test Team  
**Status**: Approved for Implementation

**Revision History**:
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-27 | Performance Team | Initial version |

**Approvals**:

- [ ] QA Lead
- [ ] Development Lead
- [ ] DevOps Lead
- [ ] Product Owner
