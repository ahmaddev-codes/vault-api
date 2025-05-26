const request = require('supertest');
const app = require('../../server');
const Agent = require('../../models/Agent');

describe('Agent Routes', () => {
  describe('POST /api/agents/register', () => {
    it('should register a new agent', async () => {
      const agentData = {
        name: 'James Bond',
        email: 'james.bond@mi6.gov.uk',
        password: 'secret123'
      };

      const response = await request(app)
        .post('/api/agents/register')
        .send(agentData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', agentData.name);
      expect(response.body).toHaveProperty('email', agentData.email);
      expect(response.body).toHaveProperty('token');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 400 for duplicate email', async () => {
      const agentData = {
        name: 'Agent 1',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      // Create first agent
      await request(app)
        .post('/api/agents/register')
        .send(agentData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/agents/register')
        .send({
          name: 'Agent 2',
          email: 'duplicate@example.com',
          password: 'password456'
        })
        .expect(400);

      expect(response.body.message).toBe('Agent already exists');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/agents/register')
        .send({
          name: 'Incomplete Agent'
          // Missing email and password
        })
        .expect(400);

      expect(response.body.message).toBe('Invalid agent data');
    });
  });

  describe('POST /api/agents/login', () => {
    beforeEach(async () => {
      // Create a test agent
      await request(app)
        .post('/api/agents/register')
        .send({
          name: 'Test Agent',
          email: 'test@example.com',
          password: 'password123'
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/agents/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', 'Test Agent');
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app)
        .post('/api/agents/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/agents/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /api/agents', () => {
    beforeEach(async () => {
      // Create test agents
      await Agent.create([
        { name: 'Agent 1', email: 'agent1@example.com', password: 'password123' },
        { name: 'Agent 2', email: 'agent2@example.com', password: 'password123' },
        { name: 'Agent 3', email: 'agent3@example.com', password: 'password123' }
      ]);
    });

    it('should get all agents', async () => {
      const response = await request(app)
        .get('/api/agents')
        .expect(200);

      expect(response.body).toHaveProperty('TotalAgents', 3);
      expect(response.body).toHaveProperty('Agents');
      expect(response.body.Agents).toHaveLength(3);

      // Check that passwords are not included
      response.body.Agents.forEach(agent => {
        expect(agent).toHaveProperty('name');
        expect(agent).toHaveProperty('email');
        expect(agent).not.toHaveProperty('password');
      });
    });

    it('should return empty array when no agents exist', async () => {
      // Clear all agents
      await Agent.deleteMany({});

      const response = await request(app)
        .get('/api/agents')
        .expect(200);

      expect(response.body).toHaveProperty('TotalAgents', 0);
      expect(response.body).toHaveProperty('Agents');
      expect(response.body.Agents).toHaveLength(0);
    });
  });
});
