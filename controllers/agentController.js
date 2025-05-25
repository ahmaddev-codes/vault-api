const { agent } = require('supertest');
const Agent = require('../models/Agent');
const generateToken = require('../utils/generateToken');

const registerAgent = async (req, res) => {
  const { name, email, password } = req.body;
  const agentExists = await Agent.findOne({ email });

  if (agentExists) return res.status(400).json({ message: 'Agent already exists' });

  const agent = await Agent.create({ name, email, password });

  if (agent) {
    res.status(201).json({
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      token: generateToken(agent._id)
    });
  } else {
    res.status(400).json({ message: 'Invalid agent data' });
  }
};

// Get all Agent
const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find({}, 'name email')
    res.status(200).json({
      TotalAgents: agents.length,
      Agents: agents
    })
  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message })
  }
}

// Authenticate and login Agent
const authAgent = async (req, res) => {
  const { email, password } = req.body;
  const agent = await Agent.findOne({ email });

  if (agent && (await agent.matchPassword(password))) {
    res.json({
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      token: generateToken(agent._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

module.exports = { registerAgent, authAgent, getAllAgents }
