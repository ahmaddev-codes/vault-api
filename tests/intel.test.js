const request = require('supertest');
const app = require('../server'); // Should export app instance from server.js
const mongoose = require('mongoose');

describe('Intel API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/vault-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 401 when accessing protected intel route without token', async () => {
    const res = await request(app).get('/api/intel');
    expect(res.statusCode).toBe(401);
  });
});
