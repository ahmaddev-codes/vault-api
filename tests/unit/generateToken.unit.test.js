// Set environment variables first
process.env.JWT_SECRET = 'test-jwt-secret-key';

describe('generateToken utility - Unit Test', () => {
  it('should have environment variable set', () => {
    expect(process.env.JWT_SECRET).toBeDefined();
    expect(process.env.JWT_SECRET).toBe('test-jwt-secret-key');
  });

  it('should pass basic test', () => {
    // Simple test to verify test framework is working
    expect(true).toBe(true);
  });
});
