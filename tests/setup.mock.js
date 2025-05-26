const mongoose = require('mongoose');

// Set test environment variables FIRST
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://localhost:27017/vault-test';

// Mock mongoose for unit tests that don't need real database
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
  disconnect: jest.fn().mockResolvedValue({}),
  connection: {
    readyState: 1,
    collections: {}
  },
  Schema: jest.requireActual('mongoose').Schema,
  model: jest.fn((name, schema) => {
    const MockModel = function(data) {
      Object.assign(this, data);
      this._id = 'mock-id-' + Date.now();
      this.id = this._id;
      return this;
    };

    MockModel.prototype.save = jest.fn().mockResolvedValue(this);
    MockModel.prototype.remove = jest.fn().mockResolvedValue(this);
    MockModel.prototype.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

    MockModel.find = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([]),
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis()
    });

    MockModel.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis()
    });

    MockModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis()
    });

    MockModel.findOneAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
      populate: jest.fn().mockReturnThis()
    });

    MockModel.findOneAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null)
    });

    MockModel.create = jest.fn().mockResolvedValue(new MockModel({}));
    MockModel.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });
    MockModel.updateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });

    return MockModel;
  })
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue('salt')
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue({ id: 'mock-user-id' })
}));

// Global test setup
beforeAll(async () => {
  // Mock any global setup needed
});

afterAll(async () => {
  // Mock cleanup
});

afterEach(() => {
  // Clear all mocks after each test
  jest.clearAllMocks();
});
