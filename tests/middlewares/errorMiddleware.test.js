const { notFound, errorHandler } = require('../../middlewares/errorMiddleware');

describe('Error Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      originalUrl: '/api/nonexistent'
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

  describe('notFound middleware', () => {
    it('should create 404 error and call next', () => {
      notFound(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).toHaveBeenCalledWith(expect.any(Error));

      const error = next.mock.calls[0][0];
      expect(error.message).toBe('Not Found - /api/nonexistent');
    });

    it('should handle different URLs', () => {
      req.originalUrl = '/different/path';

      notFound(req, res, next);

      const error = next.mock.calls[0][0];
      expect(error.message).toBe('Not Found - /different/path');
    });
  });

  describe('errorHandler middleware', () => {
    it('should handle error with default 500 status', () => {
      const error = new Error('Test error message');
      res.statusCode = 200; // Default status

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Test error message'
      });
    });

    it('should preserve existing status code if not 200', () => {
      const error = new Error('Validation error');
      res.statusCode = 400;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation error'
      });
    });

    it('should handle error with 401 status', () => {
      const error = new Error('Unauthorized');
      res.statusCode = 401;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized'
      });
    });

    it('should handle error with 404 status', () => {
      const error = new Error('Not found');
      res.statusCode = 404;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not found'
      });
    });

    it('should handle empty error message', () => {
      const error = new Error('');
      res.statusCode = 500;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: ''
      });
    });
  });
});
