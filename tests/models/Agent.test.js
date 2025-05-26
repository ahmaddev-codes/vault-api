const mongoose = require('mongoose');
const Agent = require('../../models/Agent');

describe('Agent Model', () => {
  describe('Schema validation', () => {
    it('should create an agent with valid data', async () => {
      const agentData = {
        name: 'James Bond',
        email: 'james.bond@mi6.gov.uk',
        password: 'secret123'
      };

      const agent = new Agent(agentData);
      const savedAgent = await agent.save();

      expect(savedAgent.name).toBe(agentData.name);
      expect(savedAgent.email).toBe(agentData.email);
      expect(savedAgent.password).not.toBe(agentData.password); // Should be hashed
      expect(savedAgent.createdAt).toBeDefined();
      expect(savedAgent.updatedAt).toBeDefined();
    });

    it('should require name field', async () => {
      const agentData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const agent = new Agent(agentData);

      await expect(agent.save()).rejects.toThrow();
    });

    it('should require email field', async () => {
      const agentData = {
        name: 'Test Agent',
        password: 'password123'
      };

      const agent = new Agent(agentData);

      await expect(agent.save()).rejects.toThrow();
    });

    it('should require password field', async () => {
      const agentData = {
        name: 'Test Agent',
        email: 'test@example.com'
      };

      const agent = new Agent(agentData);

      await expect(agent.save()).rejects.toThrow();
    });

    it('should enforce unique email constraint', async () => {
      const agentData = {
        name: 'Agent 1',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      const agent1 = new Agent(agentData);
      await agent1.save();

      const duplicateAgent = new Agent({
        name: 'Agent 2',
        email: 'duplicate@example.com',
        password: 'password456'
      });

      await expect(duplicateAgent.save()).rejects.toThrow();
    });
  });

  describe('Password hashing', () => {
    it('should hash password before saving', async () => {
      const plainPassword = 'mySecretPassword';
      const agent = new Agent({
        name: 'Test Agent',
        email: 'test@example.com',
        password: plainPassword
      });

      await agent.save();

      expect(agent.password).not.toBe(plainPassword);
      expect(agent.password.length).toBeGreaterThan(plainPassword.length);
    });

    it('should not hash password if it is not modified', async () => {
      const agent = new Agent({
        name: 'Test Agent',
        email: 'test@example.com',
        password: 'password123'
      });

      await agent.save();
      const originalHash = agent.password;

      agent.name = 'Updated Name';
      await agent.save();

      expect(agent.password).toBe(originalHash);
    });
  });

  describe('matchPassword method', () => {
    it('should return true for correct password', async () => {
      const plainPassword = 'correctPassword';
      const agent = new Agent({
        name: 'Test Agent',
        email: 'test@example.com',
        password: plainPassword
      });

      await agent.save();

      const isMatch = await agent.matchPassword(plainPassword);
      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const agent = new Agent({
        name: 'Test Agent',
        email: 'test@example.com',
        password: 'correctPassword'
      });

      await agent.save();

      const isMatch = await agent.matchPassword('wrongPassword');
      expect(isMatch).toBe(false);
    });
  });
});
