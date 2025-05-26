# Data Models & Schema Layer

## 🗄️ Database Models

### **Agent Model (models/Agent.js)**
- **Purpose**: User/Agent authentication and profile management
- **Schema Fields**:
  - `name`: String, required - Agent's display name
  - `email`: String, required, unique - Authentication identifier
  - `password`: String, required - Hashed password storage
  - `timestamps`: Auto-generated createdAt/updatedAt

- **Features**:
  - Pre-save password hashing with bcryptjs
  - Password comparison method for authentication
  - Email uniqueness validation
  - Automatic timestamping

### **Intel Model (models/Intel.js)**
- **Purpose**: Intelligence data storage and management
- **Schema Fields**:
  - `title`: String, required - Intel title/name
  - `description`: String, required - Detailed intel information
  - `location`: String, required - Geographic relevance
  - `agentId`: ObjectId, required, ref: 'Agent' - Owner relationship
  - `timestamps`: Auto-generated createdAt/updatedAt

- **Features**:
  - Agent relationship via ObjectId reference
  - Required field validation
  - Automatic timestamping
  - Ownership-based access control

## 🔗 Relationships

```
Agent (1) -----> (N) Intel
   │                  │
   └─ _id ←──────── agentId
```

### **Data Integrity**
- **Referential Integrity**: Intel.agentId references Agent._id
- **Cascade Operations**: Agent deletion should handle Intel cleanup
- **Validation**: Mongoose schema validation on all required fields
- **Security**: Password hashing, no plain text storage

## 🛡️ Security Features

### **Agent Security**
- Password hashing with bcryptjs (salt rounds: 10)
- Email uniqueness enforcement
- Password comparison method for authentication
- No password exposure in JSON responses

### **Intel Security**
- Agent ownership validation via agentId
- Required field validation
- MongoDB ObjectId validation for relationships

## 📊 Database Design Decisions

### **Why Mongoose ODM**
- Schema validation and middleware support
- Relationship management
- Built-in validation and type casting
- Pre/post hooks for business logic

### **Schema Patterns**
- **Embedded vs Referenced**: Using references for Agent-Intel relationship
- **Timestamps**: Automatic tracking of record creation/modification
- **Validation**: Schema-level validation for data integrity

## 🎯 Function Classification

**Primary Purpose**: Data persistence and integrity
**Technology**: MongoDB with Mongoose ODM
**Patterns**: Referenced relationships, validation middleware
**Security**: Password hashing, field validation

**Status**: ✅ Production Ready with Security
**Test Coverage**: Model validation and relationships tested
