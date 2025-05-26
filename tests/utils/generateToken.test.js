// Set environment variables before importing
process.env.JWT_SECRET = 'test-secret-key';

const jwt = require('jsonwebtoken');
const generateToken = require('../../utils/generateToken');

describe('generateToken utility', () => {
  const originalJwtSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalJwtSecret;
  });  it('should generate a valid JWT token', () => {
    const userId = '63f123456789abcdef123456';
    const token = generateToken(userId);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
  });

  it('should include user ID in token payload', () => {
    const userId = '63f123456789abcdef123456';
    const token = generateToken(userId);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(userId);
  });

  it('should set expiration to 30 days', () => {
    const userId = '63f123456789abcdef123456';
    const token = generateToken(userId);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
    const tokenLifetime = decoded.exp - decoded.iat;

    expect(tokenLifetime).toBe(thirtyDaysInSeconds);
  });

  it('should generate different tokens for different user IDs', () => {
    const userId1 = '63f123456789abcdef123456';
    const userId2 = '63f123456789abcdef654321';

    const token1 = generateToken(userId1);
    const token2 = generateToken(userId2);

    expect(token1).not.toBe(token2);
  });

  it('should generate consistent tokens for the same user ID', () => {
    const userId = '63f123456789abcdef123456';

    // Mock Date.now to ensure consistent iat (issued at) time
    const mockDate = new Date('2024-01-01T00:00:00Z').getTime();
    const originalDateNow = Date.now;
    Date.now = jest.fn(() => mockDate);

    const token1 = generateToken(userId);
    const token2 = generateToken(userId);

    expect(token1).toBe(token2);

    // Restore original Date.now
    Date.now = originalDateNow;
  });
});
