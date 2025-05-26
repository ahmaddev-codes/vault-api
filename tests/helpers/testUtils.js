const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');

/**
 * Create a test agent and return the agent data with token
 */
const createTestAgent = async (agentData = {}) => {
  const defaultData = {
    name: 'Test Agent',
    email: 'test@example.com',
    password: 'password123'
  };

  const data = { ...defaultData, ...agentData };
  const agent = await Agent.create(data);

  const token = jwt.sign({ id: agent._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  return {
    agent: {
      _id: agent._id,
      name: agent.name,
      email: agent.email
    },
    token,
    password: data.password
  };
};

/**
 * Create multiple test agents
 */
const createMultipleTestAgents = async (count = 3) => {
  const agents = [];

  for (let i = 1; i <= count; i++) {
    const agentData = await createTestAgent({
      name: `Test Agent ${i}`,
      email: `agent${i}@example.com`,
      password: 'password123'
    });
    agents.push(agentData);
  }

  return agents;
};

/**
 * Generate a mock JWT token for testing
 */
const generateMockToken = (agentId = '63f123456789abcdef123456') => {
  return jwt.sign({ id: agentId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * Generate an expired JWT token for testing
 */
const generateExpiredToken = (agentId = '63f123456789abcdef123456') => {
  return jwt.sign({ id: agentId }, process.env.JWT_SECRET, {
    expiresIn: '-1h'
  });
};

/**
 * Generate invalid JWT token for testing
 */
const generateInvalidToken = () => {
  return 'invalid.jwt.token';
};

/**
 * Create mock request object for testing
 */
const createMockRequest = (overrides = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    agent: null,
    ...overrides
  };
};

/**
 * Create mock response object for testing
 */
const createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    statusCode: 200
  };
  return res;
};

/**
 * Create mock next function for testing
 */
const createMockNext = () => {
  return jest.fn();
};

/**
 * Sleep function for async testing
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = {
  createTestAgent,
  createMultipleTestAgents,
  generateMockToken,
  generateExpiredToken,
  generateInvalidToken,
  createMockRequest,
  createMockResponse,
  createMockNext,
  sleep
};
