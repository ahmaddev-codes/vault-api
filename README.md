# Vault API

A secure backend API for secret agents to manage mission intel data. Built with Node.js, Express, MongoDB, and JWT authentication.

## 🏗️ Project Structure & File Classification

### 📁 **Core Application Files**

#### **Entry Point**
- `server.js` - Main application entry point, Express server setup

#### **Configuration**
- `config/db.js` - MongoDB database connection configuration

#### **Models (Data Layer)**
- `models/Agent.js` - Agent/User data model with authentication
- `models/Intel.js` - Intelligence data model with agent relationships

#### **Controllers (Business Logic)**
- `controllers/agentController.js` - Agent CRUD operations and authentication
- `controllers/intelController.js` - Intel CRUD operations with authorization

#### **Middleware**
- `middlewares/authMiddleware.js` - JWT authentication and authorization
- `middlewares/errorMiddleware.js` - Global error handling

#### **Routes (API Endpoints)**
- `routes/agentRoutes.js` - Agent-related API routes
- `routes/intelRoutes.js` - Intel-related API routes

#### **Utilities**
- `utils/generateToken.js` - JWT token generation utility

---

### 🧪 **Testing Infrastructure**

#### **Test Configuration**
- `jest.config.unit.js` - Unit tests with full mocking (7 suites, 37 tests) ✅
- `jest.config.auth.js` - Auth middleware tests with real JWT (1 suite, 7 tests) ✅
- `jest.config.integration.js` - Integration tests with real functionality
- `jest.config.lite.js` - Lightweight test configuration
- `jest.config.basic.js` - Basic test configuration
- `jest.config.js` - Default Jest configuration

#### **Test Setup Files**
- `tests/setup.mock.js` - Mock setup for unit tests
- `tests/setup.auth.js` - Setup for auth tests with real JWT
- `tests/setup.lite.js` - Lightweight setup for integration tests
- `tests/setup.js` - Default test setup

#### **Unit Tests (✅ All Passing)**
- `tests/controllers/agentController.test.js` - Agent controller tests (9 tests)
- `tests/controllers/agentController.unit.test.js` - Agent controller unit tests (4 tests)
- `tests/controllers/intelController.test.js` - Intel controller tests (10 tests)
- `tests/middlewares/authMiddleware.unit.test.js` - Auth middleware unit tests (5 tests)
- `tests/middlewares/errorMiddleware.test.js` - Error middleware tests (7 tests)
- `tests/unit/basic.test.js` - Basic functionality tests (5 tests)
- `tests/unit/generateToken.simple.test.js` - Simple JWT token tests (2 tests)
- `tests/unit/generateToken.unit.test.js` - JWT token unit tests (2 tests)

#### **Integration Tests**
- `tests/middlewares/authMiddleware.test.js` - Auth middleware integration tests (7 tests) ✅
- `tests/utils/generateToken.test.js` - Token generation integration tests
- `tests/routes/agentRoutes.test.js` - Agent routes integration tests
- `tests/routes/intelRoutes.test.js` - Intel routes integration tests
- `tests/integration/api.integration.test.js` - Full API integration tests

#### **Model Tests**
- `tests/models/Agent.test.js` - Agent model validation tests
- `tests/models/Intel.test.js` - Intel model validation tests

#### **Test Utilities**
- `tests/helpers/testUtils.js` - Shared testing utilities
- `tests/README.md` - Testing documentation

---

### 🐳 **DevOps & Deployment**

#### **Containerization**
- `Dockerfile` - Docker container configuration
- `docker-compose.yml` - Multi-service Docker setup

#### **Documentation**
- `docs/swagger.json` - API documentation in Swagger format
- `README.md` - This file - project overview and structure

#### **Package Management**
- `package.json` - Node.js dependencies and scripts

---

## 🚀 **Testing Commands**

| Command | Purpose | Status |
|---------|---------|---------|
| `npm run test:unit` | Run unit tests (7 suites, 37 tests) | ✅ 100% Passing |
| `npm run test:auth` | Run auth middleware tests (1 suite, 7 tests) | ✅ 100% Passing |
| `npm run test:utils` | Run utils integration tests | Available |
| `npm run test:lite` | Run lightweight tests | Available |
| `npm run test` | Default test command | Available |

## 📊 **Test Coverage Summary**

- **Total Working Tests**: 44 passing tests
- **Unit Test Success Rate**: 100% (37/37 tests passing)
- **Auth Test Success Rate**: 100% (7/7 tests passing)
- **Test Suites Passing**: 8/8 core suites

## 🔧 **Key Features**

- ✅ JWT Authentication & Authorization
- ✅ Agent Management (CRUD operations)
- ✅ Intel Data Management with ownership validation
- ✅ Comprehensive test suite with 44 passing tests
- ✅ MongoDB integration with Mongoose ODM
- ✅ Error handling middleware
- ✅ Docker containerization support
- ✅ API documentation with Swagger

## 🛠️ **Tech Stack**

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest with comprehensive mocking
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose

## 📋 **Installation & Setup**

```bash
# Install dependencies
npm install

# Run unit tests (recommended for development)
npm run test:unit

# Run auth tests
npm run test:auth

# Start development server
npm run dev

# Start production server
npm start
```

## 🏆 **Project Status**

This project has a **robust, reliable test suite** with **100% success rate** on core functionality:
- ✅ All unit tests passing (37/37)
- ✅ All auth tests passing (7/7)
- ✅ Critical bugs fixed in middleware and controllers
- ✅ Proper test isolation and mocking strategy
- ✅ Ready for CI/CD integration