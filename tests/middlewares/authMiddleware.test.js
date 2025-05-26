// Set environment variables before importing anything
process.env.JWT_SECRET = 'test-jwt-secret-key';

const jwt = require('jsonwebtoken');
const { protect } = require('../../middlewares/authMiddleware');
const Agent = require('../../models/Agent');

// Mock the Agent model
jest.mock('../../models/Agent');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('protect middleware', () => {
    it('should authenticate user with valid token', async () => {
      const userId = '63f123456789abcdef123456';
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
      const mockAgent = {
        _id: userId,
        name: 'Test Agent',
        email: 'test@example.com'
      };      req.headers.authorization = `Bearer ${token}`;
      Agent.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockAgent)
      });

      await protect(req, res, next);

      expect(Agent.findById).toHaveBeenCalledWith(userId);
      expect(req.agent).toEqual(mockAgent);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject request with no authorization header', async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, no token'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token format', async () => {
      req.headers.authorization = 'InvalidFormat token123';

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, no token'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', async () => {
      req.headers.authorization = 'Bearer invalid.token.here';

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, token failed'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with expired token', async () => {
      const userId = '63f123456789abcdef123456';
      const expiredToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '-1h' }
      );

      req.headers.authorization = `Bearer ${expiredToken}`;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, token failed'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle database error when finding agent', async () => {
      const userId = '63f123456789abcdef123456';
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

      req.headers.authorization = `Bearer ${token}`;
      Agent.findById.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authorized, token failed'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject when agent not found', async () => {
      const userId = '63f123456789abcdef123456';
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

      req.headers.authorization = `Bearer ${token}`;
      Agent.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await protect(req, res, next);

      expect(req.agent).toBeNull();
      expect(next).toHaveBeenCalled();
    });
  });
});
