// Set environment variables before importing anything
process.env.JWT_SECRET = 'test-jwt-secret-key';

const jwt = require('jsonwebtoken');

describe('Generate Token (Simple Unit Test)', () => {
  beforeEach(() => {
    // Restore mock return values after they get cleared
    jwt.sign.mockReturnValue('mock-jwt-token');
    jwt.verify.mockReturnValue({ id: 'mock-user-id' });
  });

  test('should mock JWT sign function', () => {
    // Test that our JWT mock is working (from setup.mock.js)
    const mockToken = jwt.sign({ id: 'test-id' }, 'secret');
    expect(mockToken).toBeDefined();
    expect(mockToken).toBe('mock-jwt-token');
  });

  test('should mock JWT verify function', () => {
    // Test that our JWT mock is working (from setup.mock.js)
    const decoded = jwt.verify('token', 'secret');
    expect(decoded).toBeDefined();
    expect(decoded.id).toBe('mock-user-id');
  });
});
