# Vault API - File Classification & Project Structure

## 📁 Directory Structure Overview

```
vault-api/
├── 📄 Core Application Files
│   ├── server.js                    # Main application entry point
│   ├── package.json                 # Node.js dependencies and scripts
│   └── package-lock.json            # Dependency lock file
│
├── ⚙️ Configuration
│   ├── config/
│   │   └── db.js                    # MongoDB connection configuration
│   ├── .env                         # Environment variables (excluded from git)
│   ├── .env.test                    # Test environment variables
│   └── .gitignore                   # Git ignore patterns
│
├── 🏗️ Application Architecture
│   ├── models/                      # Data Models (Mongoose schemas)
│   │   ├── Agent.js                 # Agent/User data model
│   │   └── Intel.js                 # Intelligence data model
│   │
│   ├── controllers/                 # Business Logic Controllers
│   │   ├── agentController.js       # Agent CRUD operations
│   │   └── intelController.js       # Intel CRUD operations
│   │
│   ├── middlewares/                 # Express Middleware
│   │   ├── authMiddleware.js        # JWT authentication
│   │   └── errorMiddleware.js       # Global error handling
│   │
│   ├── routes/                      # API Route Definitions
│   │   ├── agentRoutes.js          # Agent-related endpoints
│   │   └── intelRoutes.js          # Intel-related endpoints
│   │
│   └── utils/                       # Utility Functions
│       └── generateToken.js         # JWT token generation
│
├── 🧪 Testing Infrastructure
│   ├── Jest Configuration Files
│   │   ├── jest.config.unit.js      # Unit tests (37 tests ✅)
│   │   ├── jest.config.auth.js      # Auth tests (7 tests ✅)
│   │   ├── jest.config.integration.js # Integration tests
│   │   ├── jest.config.lite.js      # Lightweight tests
│   │   ├── jest.config.basic.js     # Basic tests
│   │   └── jest.config.js           # Default configuration
│   │
│   ├── Test Setup Files
│   │   ├── tests/setup.mock.js      # Mock setup for unit tests
│   │   ├── tests/setup.auth.js      # Setup for auth tests
│   │   ├── tests/setup.lite.js      # Lightweight setup
│   │   └── tests/setup.js           # Default test setup
│   │
│   ├── Unit Tests (100% Passing ✅)
│   │   ├── tests/controllers/       # Controller tests
│   │   │   ├── agentController.test.js
│   │   │   ├── agentController.unit.test.js
│   │   │   └── intelController.test.js
│   │   ├── tests/middlewares/       # Middleware tests
│   │   │   ├── authMiddleware.unit.test.js
│   │   │   └── errorMiddleware.test.js
│   │   └── tests/unit/              # Core unit tests
│   │       ├── basic.test.js
│   │       ├── generateToken.simple.test.js
│   │       └── generateToken.unit.test.js
│   │
│   ├── Integration Tests
│   │   ├── tests/middlewares/authMiddleware.test.js (✅)
│   │   ├── tests/routes/            # Route integration tests
│   │   │   ├── agentRoutes.test.js
│   │   │   └── intelRoutes.test.js
│   │   ├── tests/utils/generateToken.test.js
│   │   └── tests/integration/api.integration.test.js
│   │
│   ├── Model Tests
│   │   └── tests/models/
│   │       ├── Agent.test.js
│   │       └── Intel.test.js
│   │
│   └── Test Utilities
│       ├── tests/helpers/testUtils.js
│       └── tests/README.md
│
├── 🐳 DevOps & Deployment
│   ├── Dockerfile                   # Docker container setup
│   ├── docker-compose.yml          # Multi-service Docker configuration
│   └── docs/
│       └── swagger.json             # API documentation
│
└── 📚 Documentation
    ├── README.md                    # Project overview & file classification
    └── ARCHITECTURE.md              # This file - detailed structure
```

## 🔄 File Function Classification

### **1. Entry & Configuration (4 files)**
- **Purpose**: Application bootstrap and environment setup
- **Files**: `server.js`, `package.json`, `config/db.js`, environment files

### **2. Data Layer (2 files)**
- **Purpose**: Database models and schemas
- **Files**: `models/Agent.js`, `models/Intel.js`
- **Technology**: Mongoose ODM for MongoDB

### **3. Business Logic (2 files)**
- **Purpose**: Core application logic and data processing
- **Files**: `controllers/agentController.js`, `controllers/intelController.js`
- **Features**: CRUD operations, validation, authorization

### **4. API Layer (4 files)**
- **Purpose**: HTTP request/response handling and routing
- **Files**: `routes/`, `middlewares/`
- **Features**: RESTful APIs, JWT auth, error handling

### **5. Utilities (1 file)**
- **Purpose**: Shared helper functions
- **Files**: `utils/generateToken.js`
- **Features**: JWT token generation and validation

### **6. Testing Suite (25+ files)**
- **Purpose**: Quality assurance and reliability
- **Coverage**: 44 passing tests across 8 test suites
- **Types**: Unit tests, integration tests, auth tests, model tests

### **7. DevOps (3 files)**
- **Purpose**: Deployment and containerization
- **Files**: `Dockerfile`, `docker-compose.yml`, `docs/swagger.json`
- **Features**: Docker support, API documentation

### **8. Documentation (2 files)**
- **Purpose**: Project documentation and guides
- **Files**: `README.md`, `ARCHITECTURE.md`

## 🎯 Key Architectural Decisions

### **Separation of Concerns**
- **Models**: Pure data definitions with validation
- **Controllers**: Business logic without HTTP concerns
- **Routes**: HTTP handling without business logic
- **Middlewares**: Cross-cutting concerns (auth, error handling)

### **Testing Strategy**
- **Unit Tests**: Fast, isolated tests with mocking
- **Integration Tests**: Real component interaction tests
- **Specialized Configs**: Different Jest configs for different test types

### **Security Architecture**
- **JWT Authentication**: Stateless token-based auth
- **Authorization**: Resource ownership validation
- **Input Validation**: Mongoose schema validation
- **Error Handling**: Secure error responses

### **Development Workflow**
- **Test-Driven**: 100% passing test suite
- **Environment Separation**: Different configs for dev/test/prod
- **Docker Support**: Containerized deployment
- **Documentation**: Comprehensive API docs with Swagger

## 📊 Quality Metrics

- **Test Coverage**: 44 passing tests
- **Code Organization**: 8 distinct functional categories
- **Architecture Compliance**: Clean separation of concerns
- **Security**: JWT auth + authorization at every level
- **Documentation**: Complete file classification and structure docs

This architecture provides a solid foundation for a secure, scalable, and maintainable API service.
