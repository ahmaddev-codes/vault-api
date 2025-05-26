# Vault API Test Suite

This document describes the comprehensive test suite for the Vault API project using Jest.

## Test Structure

```
tests/
├── setup.js                     # Test setup and configuration
├── helpers/
│   └── testUtils.js             # Common test utilities and helpers
├── models/
│   ├── Agent.test.js            # Agent model tests
│   └── Intel.test.js            # Intel model tests
├── controllers/
│   ├── agentController.test.js  # Agent controller tests
│   └── intelController.test.js  # Intel controller tests
├── middlewares/
│   ├── authMiddleware.test.js   # Authentication middleware tests
│   └── errorMiddleware.test.js  # Error handling middleware tests
├── routes/
│   ├── agentRoutes.test.js      # Agent routes integration tests
│   └── intelRoutes.test.js      # Intel routes integration tests
├── utils/
│   └── generateToken.test.js    # JWT token generation utility tests
└── integration/
    └── api.integration.test.js  # Full API integration tests
```

## Test Categories

### 1. Unit Tests

#### Models (`tests/models/`)
- **Agent.test.js**: Tests for Agent model schema validation, password hashing, and authentication methods
- **Intel.test.js**: Tests for Intel model schema validation and relationships

#### Controllers (`tests/controllers/`)
- **agentController.test.js**: Tests for agent registration, authentication, and listing functionality
- **intelController.test.js**: Tests for intel CRUD operations and authorization

#### Middlewares (`tests/middlewares/`)
- **authMiddleware.test.js**: Tests for JWT token validation and user authentication
- **errorMiddleware.test.js**: Tests for error handling and 404 responses

#### Utils (`tests/utils/`)
- **generateToken.test.js**: Tests for JWT token generation utility

### 2. Integration Tests

#### Routes (`tests/routes/`)
- **agentRoutes.test.js**: End-to-end tests for agent API endpoints
- **intelRoutes.test.js**: End-to-end tests for intel API endpoints

#### Full Integration (`tests/integration/`)
- **api.integration.test.js**: Complete workflow tests covering the entire API

## Test Features

### Database Testing
- Uses MongoDB Memory Server for isolated testing
- Automatic database cleanup between tests
- No dependency on external database

### Authentication Testing
- JWT token generation and validation
- Protected route testing
- Authorization and permission testing

### Error Handling Testing
- Invalid input validation
- Authentication errors
- Authorization errors
- Database errors

### Coverage Areas
- Schema validation
- Business logic
- API endpoints
- Authentication/Authorization
- Error handling
- Edge cases

## Running Tests

### All Tests
```bash
npm test
```

### Test Categories
```bash
# Run specific test categories
npm run test:models        # Model tests only
npm run test:controllers   # Controller tests only
npm run test:routes        # Route tests only
npm run test:integration   # Integration tests only
```

### Test Options
```bash
# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage

# Verbose output
npm run test:verbose
```

## Test Configuration

### Jest Configuration (`jest.config.js`)
- Node.js test environment
- Automatic setup and teardown
- Coverage reporting
- Test file patterns

### Test Setup (`tests/setup.js`)
- MongoDB Memory Server initialization
- Database connection and cleanup
- Environment variable setup

## Test Utilities (`tests/helpers/testUtils.js`)

### Helper Functions
- `createTestAgent()`: Create test agent with token
- `createMultipleTestAgents()`: Create multiple test agents
- `generateMockToken()`: Generate valid JWT token
- `generateExpiredToken()`: Generate expired JWT token
- `generateInvalidToken()`: Generate invalid JWT token
- `createMockRequest()`: Create mock Express request
- `createMockResponse()`: Create mock Express response
- `createMockNext()`: Create mock Express next function

## Test Coverage

The test suite provides comprehensive coverage of:

### Models (100% coverage target)
- ✅ Schema validation
- ✅ Required fields
- ✅ Unique constraints
- ✅ Password hashing
- ✅ Instance methods
- ✅ Relationships

### Controllers (100% coverage target)
- ✅ Success scenarios
- ✅ Error scenarios
- ✅ Input validation
- ✅ Database operations
- ✅ Authentication logic

### Routes (100% coverage target)
- ✅ HTTP methods
- ✅ Authentication required
- ✅ Authorization checks
- ✅ Request/Response formats
- ✅ Status codes

### Middleware (100% coverage target)
- ✅ Authentication middleware
- ✅ Error handling middleware
- ✅ Token validation
- ✅ Error formatting

## Best Practices

### Test Organization
- One test file per source file
- Grouped tests by functionality
- Clear test descriptions
- Isolated test cases

### Test Data
- Use test utilities for consistent data
- Clean database between tests
- Mock external dependencies
- Use meaningful test data

### Assertions
- Test both success and failure cases
- Verify response structure
- Check status codes
- Validate error messages

### Performance
- Use beforeEach/afterEach for setup/cleanup
- Mock heavy operations
- Use memory database for speed
- Parallel test execution where possible

## Running Specific Tests

```bash
# Run a specific test file
npx jest tests/models/Agent.test.js

# Run tests matching a pattern
npx jest --testNamePattern="should register"

# Run tests in a specific directory
npx jest tests/controllers/

# Run with coverage for specific files
npx jest --coverage --collectCoverageFrom="controllers/**/*.js"
```

## Continuous Integration

The test suite is designed to work with CI/CD pipelines:

- Fast execution with in-memory database
- No external dependencies
- Comprehensive error reporting
- Coverage reporting for quality gates

## Debugging Tests

```bash
# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Verbose output with detailed error messages
npm run test:verbose

# Run only failing tests
npx jest --onlyFailures
```

This test suite ensures the Vault API is robust, secure, and maintains high code quality standards.
