const {
  registerAgent,
  authAgent,
  getAllAgents
} = require('../../controllers/agentController');
const Agent = require('../../models/Agent');
const generateToken = require('../../utils/generateToken');

// Mock dependencies
jest.mock('../../models/Agent');
jest.mock('../../utils/generateToken');

describe('Agent Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerAgent', () => {
    it('should register a new agent successfully', async () => {
      const agentData = {
        name: 'James Bond',
        email: 'james.bond@mi6.gov.uk',
        password: 'secret123'
      };
      const mockAgent = {
        _id: '63f123456789abcdef123456',
        ...agentData
      };
      const mockToken = 'mock.jwt.token';

      req.body = agentData;
      Agent.findOne.mockResolvedValue(null);
      Agent.create.mockResolvedValue(mockAgent);
      generateToken.mockReturnValue(mockToken);

      await registerAgent(req, res);

      expect(Agent.findOne).toHaveBeenCalledWith({ email: agentData.email });
      expect(Agent.create).toHaveBeenCalledWith(agentData);
      expect(generateToken).toHaveBeenCalledWith(mockAgent._id);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        _id: mockAgent._id,
        name: mockAgent.name,
        email: mockAgent.email,
        token: mockToken
      });
    });

    it('should return error if agent already exists', async () => {
      const agentData = {
        name: 'James Bond',
        email: 'james.bond@mi6.gov.uk',
        password: 'secret123'
      };
      const existingAgent = { _id: '123', email: agentData.email };

      req.body = agentData;
      Agent.findOne.mockResolvedValue(existingAgent);

      await registerAgent(req, res);

      expect(Agent.findOne).toHaveBeenCalledWith({ email: agentData.email });
      expect(Agent.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Agent already exists'
      });
    });

    it('should return error if agent creation fails', async () => {
      const agentData = {
        name: 'James Bond',
        email: 'james.bond@mi6.gov.uk',
        password: 'secret123'
      };

      req.body = agentData;
      Agent.findOne.mockResolvedValue(null);
      Agent.create.mockResolvedValue(null);

      await registerAgent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid agent data'
      });
    });
  });

  describe('authAgent', () => {
    it('should authenticate agent with valid credentials', async () => {
      const credentials = {
        email: 'james.bond@mi6.gov.uk',
        password: 'secret123'
      };
      const mockAgent = {
        _id: '63f123456789abcdef123456',
        name: 'James Bond',
        email: credentials.email,
        matchPassword: jest.fn().mockResolvedValue(true)
      };
      const mockToken = 'mock.jwt.token';

      req.body = credentials;
      Agent.findOne.mockResolvedValue(mockAgent);
      generateToken.mockReturnValue(mockToken);

      await authAgent(req, res);

      expect(Agent.findOne).toHaveBeenCalledWith({ email: credentials.email });
      expect(mockAgent.matchPassword).toHaveBeenCalledWith(credentials.password);
      expect(generateToken).toHaveBeenCalledWith(mockAgent._id);
      expect(res.json).toHaveBeenCalledWith({
        _id: mockAgent._id,
        name: mockAgent.name,
        email: mockAgent.email,
        token: mockToken
      });
    });

    it('should return error for invalid email', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'secret123'
      };

      req.body = credentials;
      Agent.findOne.mockResolvedValue(null);

      await authAgent(req, res);

      expect(Agent.findOne).toHaveBeenCalledWith({ email: credentials.email });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });

    it('should return error for invalid password', async () => {
      const credentials = {
        email: 'james.bond@mi6.gov.uk',
        password: 'wrongpassword'
      };
      const mockAgent = {
        _id: '63f123456789abcdef123456',
        email: credentials.email,
        matchPassword: jest.fn().mockResolvedValue(false)
      };

      req.body = credentials;
      Agent.findOne.mockResolvedValue(mockAgent);

      await authAgent(req, res);

      expect(mockAgent.matchPassword).toHaveBeenCalledWith(credentials.password);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });
  });

  describe('getAllAgents', () => {
    it('should return all agents successfully', async () => {
      const mockAgents = [
        { _id: '1', name: 'Agent 1', email: 'agent1@example.com' },
        { _id: '2', name: 'Agent 2', email: 'agent2@example.com' }
      ];

      Agent.find.mockResolvedValue(mockAgents);

      await getAllAgents(req, res);

      expect(Agent.find).toHaveBeenCalledWith({}, 'name email');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        TotalAgents: mockAgents.length,
        Agents: mockAgents
      });
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      Agent.find.mockRejectedValue(error);

      await getAllAgents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Server error',
        message: error.message
      });
    });

    it('should return empty array when no agents exist', async () => {
      Agent.find.mockResolvedValue([]);

      await getAllAgents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        TotalAgents: 0,
        Agents: []
      });
    });
  });
});
