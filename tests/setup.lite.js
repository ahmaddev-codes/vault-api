// Lightweight test setup without MongoDB Memory Server
// Uses real MongoDB connection (requires MongoDB to be running)

const mongoose = require('mongoose');

let isConnected = false;

beforeAll(async () => {
  try {
    if (!isConnected) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/vault-test';
      await mongoose.connect(mongoUri);
      isConnected = true;
    }
  } catch (error) {
    console.warn('MongoDB connection failed, falling back to mocks:', error.message);
    // If real MongoDB is not available, we'll use mocks
    jest.doMock('mongoose');
  }
}, 10000);

afterAll(async () => {
  try {
    if (isConnected && mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      isConnected = false;
    }
  } catch (error) {
    console.error('Teardown error:', error);
  }
}, 10000);

afterEach(async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    try {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
    } catch (error) {
      console.warn('Collection cleanup failed:', error.message);
    }
  }
});

// Set environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.NODE_ENV = 'test';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vault-test';
