const { registerAgent, authAgent, getAllAgents } = require('../../controllers/agentController');
const Agent = require('../../models/Agent');
const generateToken = require('../../utils/generateToken');

// Mock the dependencies
jest.mock('../../models/Agent');
jest.mock('../../utils/generateToken');

describe('Agent Controller (Simple Unit Tests)', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 'mock-user-id' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('registerAgent', () => {
    test('should register a new agent successfully', async () => {
      req.body = {
        name: 'Test Agent',
        email: 'test@example.com',
        password: 'password123'
      };

      const mockAgent = {
        _id: 'mock-agent-id',
        name: 'Test Agent',
        email: 'test@example.com',
        save: jest.fn().mockResolvedValue(true)
      };      Agent.findOne.mockResolvedValue(null);
      Agent.create.mockResolvedValue(mockAgent);
      generateToken.mockReturnValue('mock-jwt-token');

      await registerAgent(req, res);expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: 'mock-agent-id',
          name: 'Test Agent',
          email: 'test@example.com',
          token: expect.any(String)
        })
      );
    });

    test('should return 400 if agent already exists', async () => {
      req.body = {
        name: 'Test Agent',
        email: 'test@example.com',
        password: 'password123'
      };

      Agent.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ email: 'test@example.com' })
      });

      await registerAgent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('already exists')
        })
      );
    });
  });

  describe('getAgents', () => {
    test('should get all agents successfully', async () => {
      const mockAgents = [
        { _id: '1', name: 'Agent 1', email: 'agent1@example.com' },
        { _id: '2', name: 'Agent 2', email: 'agent2@example.com' }
      ];      Agent.find.mockResolvedValue(mockAgents);

      await getAllAgents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          TotalAgents: mockAgents.length,
          Agents: mockAgents
        })
      );
    });

    test('should handle empty agent list', async () => {      Agent.find.mockResolvedValue([]);

      await getAllAgents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          TotalAgents: 0,
          Agents: []
        })
      );
    });
  });
});
