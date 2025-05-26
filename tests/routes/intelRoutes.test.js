const request = require('supertest');
const app = require('../../server');
const Agent = require('../../models/Agent');
const Intel = require('../../models/Intel');

describe('Intel Routes', () => {
  let authToken;
  let agentId;
  let otherAgentId;
  let otherAuthToken;

  beforeEach(async () => {
    // Create test agent
    const agentResponse = await request(app)
      .post('/api/agents/register')
      .send({
        name: 'Test Agent',
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = agentResponse.body.token;
    agentId = agentResponse.body._id;

    // Create another agent for authorization tests
    const otherAgentResponse = await request(app)
      .post('/api/agents/register')
      .send({
        name: 'Other Agent',
        email: 'other@example.com',
        password: 'password123'
      });

    otherAuthToken = otherAgentResponse.body.token;
    otherAgentId = otherAgentResponse.body._id;
  });

  describe('POST /api/intel', () => {
    it('should create intel with valid token', async () => {
      const intelData = {
        agentId: agentId,
        title: 'Mission Alpha',
        description: 'Classified mission details',
        location: 'Moscow, Russia'
      };

      const response = await request(app)
        .post('/api/intel')
        .set('Authorization', `Bearer ${authToken}`)
        .send(intelData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('title', intelData.title);
      expect(response.body).toHaveProperty('description', intelData.description);
      expect(response.body).toHaveProperty('location', intelData.location);
      expect(response.body).toHaveProperty('agentId', agentId);
    });

    it('should return 401 without auth token', async () => {
      const intelData = {
        agentId: agentId,
        title: 'Mission Alpha',
        description: 'Classified mission details',
        location: 'Moscow, Russia'
      };

      const response = await request(app)
        .post('/api/intel')
        .send(intelData)
        .expect(401);

      expect(response.body.message).toBe('Not authorized, no token');
    });

    it('should return 401 with invalid token', async () => {
      const intelData = {
        agentId: agentId,
        title: 'Mission Alpha',
        description: 'Classified mission details',
        location: 'Moscow, Russia'
      };

      const response = await request(app)
        .post('/api/intel')
        .set('Authorization', 'Bearer invalid.token.here')
        .send(intelData)
        .expect(401);

      expect(response.body.message).toBe('Not authorized, token failed');
    });
  });

  describe('GET /api/intel', () => {
    beforeEach(async () => {
      // Create test intel
      await Intel.create([
        {
          title: 'Intel 1',
          description: 'Description 1',
          location: 'Location 1',
          agentId: agentId
        },
        {
          title: 'Intel 2',
          description: 'Description 2',
          location: 'Location 2',
          agentId: otherAgentId
        }
      ]);
    });

    it('should get all intel with valid token', async () => {
      const response = await request(app)
        .get('/api/intel')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/api/intel')
        .expect(401);

      expect(response.body.message).toBe('Not authorized, no token');
    });
  });

  describe('GET /api/intel/:id', () => {
    let intelId;

    beforeEach(async () => {
      const intel = await Intel.create({
        title: 'Test Intel',
        description: 'Test Description',
        location: 'Test Location',
        agentId: agentId
      });
      intelId = intel._id;
    });

    it('should get agent intel with valid token', async () => {
      const response = await request(app)
        .get(`/api/intel/${intelId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get(`/api/intel/${intelId}`)
        .expect(401);

      expect(response.body.message).toBe('Not authorized, no token');
    });
  });

  describe('PUT /api/intel/:id', () => {
    let intelId;
    let otherIntelId;

    beforeEach(async () => {
      const intel = await Intel.create({
        title: 'Original Title',
        description: 'Original Description',
        location: 'Original Location',
        agentId: agentId
      });
      intelId = intel._id;

      const otherIntel = await Intel.create({
        title: 'Other Title',
        description: 'Other Description',
        location: 'Other Location',
        agentId: otherAgentId
      });
      otherIntelId = otherIntel._id;
    });

    it('should update intel when agent owns it', async () => {
      const updateData = {
        _id: intelId,
        title: 'Updated Title',
        description: 'Updated Description',
        location: 'Updated Location'
      };

      const response = await request(app)
        .put(`/api/intel/${intelId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.location).toBe(updateData.location);
    });

    it('should return 404 when agent does not own intel', async () => {
      const updateData = {
        _id: otherIntelId,
        title: 'Updated Title'
      };

      const response = await request(app)
        .put(`/api/intel/${otherIntelId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.message).toBe('Intel not found or unauthorized');
    });

    it('should return 401 without auth token', async () => {
      const updateData = {
        _id: intelId,
        title: 'Updated Title'
      };

      const response = await request(app)
        .put(`/api/intel/${intelId}`)
        .send(updateData)
        .expect(401);

      expect(response.body.message).toBe('Not authorized, no token');
    });
  });

  describe('DELETE /api/intel/:id', () => {
    let intelId;
    let otherIntelId;

    beforeEach(async () => {
      const intel = await Intel.create({
        title: 'To Delete',
        description: 'Will be deleted',
        location: 'Deletion Location',
        agentId: agentId
      });
      intelId = intel._id;

      const otherIntel = await Intel.create({
        title: 'Other Intel',
        description: 'Other Description',
        location: 'Other Location',
        agentId: otherAgentId
      });
      otherIntelId = otherIntel._id;
    });

    it('should delete intel when agent owns it', async () => {
      const response = await request(app)
        .delete(`/api/intel/${intelId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Intel removed');

      // Verify intel is deleted
      const deletedIntel = await Intel.findById(intelId);
      expect(deletedIntel).toBeNull();
    });

    it('should return 404 when agent does not own intel', async () => {
      const response = await request(app)
        .delete(`/api/intel/${otherIntelId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe('Intel not found or unauthorized');
    });

    it('should return 404 for non-existent intel', async () => {
      const fakeId = '63f123456789abcdef999999';

      const response = await request(app)
        .delete(`/api/intel/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe('Intel not found or unauthorized');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .delete(`/api/intel/${intelId}`)
        .expect(401);

      expect(response.body.message).toBe('Not authorized, no token');
    });
  });
});
