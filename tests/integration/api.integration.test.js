const request = require('supertest');
const app = require('../server');
const Agent = require('../models/Agent');
const Intel = require('../models/Intel');

describe('Vault API Integration Tests', () => {
  describe('Complete Agent and Intel Workflow', () => {
    let agent1Token, agent2Token;
    let agent1Id, agent2Id;
    let intel1Id, intel2Id;

    it('should complete full agent registration and intel management workflow', async () => {
      // 1. Register two agents
      const agent1Response = await request(app)
        .post('/api/agents/register')
        .send({
          name: 'Agent Smith',
          email: 'smith@agency.gov',
          password: 'secret123'
        })
        .expect(201);

      const agent2Response = await request(app)
        .post('/api/agents/register')
        .send({
          name: 'Agent Johnson',
          email: 'johnson@agency.gov',
          password: 'secret456'
        })
        .expect(201);

      agent1Token = agent1Response.body.token;
      agent2Token = agent2Response.body.token;
      agent1Id = agent1Response.body._id;
      agent2Id = agent2Response.body._id;

      expect(agent1Response.body).toHaveProperty('name', 'Agent Smith');
      expect(agent2Response.body).toHaveProperty('name', 'Agent Johnson');

      // 2. Login agents
      const login1Response = await request(app)
        .post('/api/agents/login')
        .send({
          email: 'smith@agency.gov',
          password: 'secret123'
        })
        .expect(200);

      const login2Response = await request(app)
        .post('/api/agents/login')
        .send({
          email: 'johnson@agency.gov',
          password: 'secret456'
        })
        .expect(200);

      expect(login1Response.body.token).toBeDefined();
      expect(login2Response.body.token).toBeDefined();

      // 3. Get all agents
      const allAgentsResponse = await request(app)
        .get('/api/agents')
        .expect(200);

      expect(allAgentsResponse.body.TotalAgents).toBe(2);
      expect(allAgentsResponse.body.Agents).toHaveLength(2);

      // 4. Create intel for each agent
      const intel1Response = await request(app)
        .post('/api/intel')
        .set('Authorization', `Bearer ${agent1Token}`)
        .send({
          agentId: agent1Id,
          title: 'Operation Nightfall',
          description: 'Infiltrate enemy base',
          location: 'Eastern Europe'
        })
        .expect(201);

      const intel2Response = await request(app)
        .post('/api/intel')
        .set('Authorization', `Bearer ${agent2Token}`)
        .send({
          agentId: agent2Id,
          title: 'Mission Daybreak',
          description: 'Secure communication lines',
          location: 'Southeast Asia'
        })
        .expect(201);

      intel1Id = intel1Response.body._id;
      intel2Id = intel2Response.body._id;

      expect(intel1Response.body.title).toBe('Operation Nightfall');
      expect(intel2Response.body.title).toBe('Mission Daybreak');

      // 5. Get all intel
      const allIntelResponse = await request(app)
        .get('/api/intel')
        .set('Authorization', `Bearer ${agent1Token}`)
        .expect(200);

      expect(allIntelResponse.body).toHaveLength(2);

      // 6. Get specific agent intel
      const agent1IntelResponse = await request(app)
        .get(`/api/intel/${intel1Id}`)
        .set('Authorization', `Bearer ${agent1Token}`)
        .expect(200);

      expect(Array.isArray(agent1IntelResponse.body)).toBe(true);

      // 7. Update intel (agent can only update their own)
      const updateResponse = await request(app)
        .put(`/api/intel/${intel1Id}`)
        .set('Authorization', `Bearer ${agent1Token}`)
        .send({
          _id: intel1Id,
          title: 'Operation Nightfall - Updated',
          description: 'Infiltrate enemy base - Phase 2',
          location: 'Eastern Europe - Sector 7'
        })
        .expect(200);

      expect(updateResponse.body.title).toBe('Operation Nightfall - Updated');

      // 8. Try to update another agent's intel (should fail)
      await request(app)
        .put(`/api/intel/${intel2Id}`)
        .set('Authorization', `Bearer ${agent1Token}`)
        .send({
          _id: intel2Id,
          title: 'Unauthorized Update'
        })
        .expect(404);

      // 9. Delete intel (agent can only delete their own)
      await request(app)
        .delete(`/api/intel/${intel1Id}`)
        .set('Authorization', `Bearer ${agent1Token}`)
        .expect(200);

      // 10. Try to delete another agent's intel (should fail)
      await request(app)
        .delete(`/api/intel/${intel2Id}`)
        .set('Authorization', `Bearer ${agent1Token}`)
        .expect(404);

      // 11. Verify intel was deleted
      const finalIntelResponse = await request(app)
        .get('/api/intel')
        .set('Authorization', `Bearer ${agent1Token}`)
        .expect(200);

      expect(finalIntelResponse.body).toHaveLength(1);
      expect(finalIntelResponse.body[0].title).toBe('Mission Daybreak');
    });

    it('should handle authentication errors properly', async () => {
      // Try to create intel without token
      await request(app)
        .post('/api/intel')
        .send({
          title: 'Unauthorized Intel',
          description: 'This should fail',
          location: 'Nowhere'
        })
        .expect(401);

      // Try to access intel with invalid token
      await request(app)
        .get('/api/intel')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);

      // Try to login with wrong credentials
      await request(app)
        .post('/api/agents/login')
        .send({
          email: 'wrong@email.com',
          password: 'wrongpassword'
        })
        .expect(401);
    });

    it('should handle validation errors properly', async () => {
      // Register agent first
      const agentResponse = await request(app)
        .post('/api/agents/register')
        .send({
          name: 'Validation Agent',
          email: 'validation@test.com',
          password: 'password123'
        })
        .expect(201);

      const token = agentResponse.body.token;

      // Try to create intel with missing fields
      await request(app)
        .post('/api/intel')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Incomplete Intel'
          // Missing description, location, agentId
        })
        .expect(500); // This will cause a validation error

      // Try to register agent with duplicate email
      await request(app)
        .post('/api/agents/register')
        .send({
          name: 'Duplicate Agent',
          email: 'validation@test.com', // Same email
          password: 'password456'
        })
        .expect(400);
    });
  });

  describe('API Root Endpoint', () => {
    it('should respond to root endpoint', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toBe('Vault API is running');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });
});
