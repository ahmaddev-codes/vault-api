const mongoose = require('mongoose');
const Intel = require('../../models/Intel');
const Agent = require('../../models/Agent');

describe('Intel Model', () => {
  let agentId;

  beforeEach(async () => {
    const agent = new Agent({
      name: 'Test Agent',
      email: 'test@example.com',
      password: 'password123'
    });
    const savedAgent = await agent.save();
    agentId = savedAgent._id;
  });

  describe('Schema validation', () => {
    it('should create intel with valid data', async () => {
      const intelData = {
        title: 'Mission Alpha',
        description: 'Classified mission details',
        location: 'Moscow, Russia',
        agentId: agentId
      };

      const intel = new Intel(intelData);
      const savedIntel = await intel.save();

      expect(savedIntel.title).toBe(intelData.title);
      expect(savedIntel.description).toBe(intelData.description);
      expect(savedIntel.location).toBe(intelData.location);
      expect(savedIntel.agentId.toString()).toBe(agentId.toString());
      expect(savedIntel.createdAt).toBeDefined();
      expect(savedIntel.updatedAt).toBeDefined();
    });

    it('should require title field', async () => {
      const intel = new Intel({
        description: 'Test description',
        location: 'Test location',
        agentId: agentId
      });

      await expect(intel.save()).rejects.toThrow();
    });

    it('should require description field', async () => {
      const intel = new Intel({
        title: 'Test title',
        location: 'Test location',
        agentId: agentId
      });

      await expect(intel.save()).rejects.toThrow();
    });

    it('should require location field', async () => {
      const intel = new Intel({
        title: 'Test title',
        description: 'Test description',
        agentId: agentId
      });

      await expect(intel.save()).rejects.toThrow();
    });

    it('should require agentId field', async () => {
      const intel = new Intel({
        title: 'Test title',
        description: 'Test description',
        location: 'Test location'
      });

      await expect(intel.save()).rejects.toThrow();
    });

    it('should reference Agent model correctly', async () => {
      const intel = new Intel({
        title: 'Mission Bravo',
        description: 'Top secret operation',
        location: 'Berlin, Germany',
        agentId: agentId
      });

      await intel.save();
      const populatedIntel = await Intel.findById(intel._id).populate('agentId');

      expect(populatedIntel.agentId.name).toBe('Test Agent');
      expect(populatedIntel.agentId.email).toBe('test@example.com');
    });
  });
});
