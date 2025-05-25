const jwt = require('jsonwebtoken');
const Agent = require('../models/Agent');
const generateToken = require('../utils/generateToken');

exports.registerAgent = async (req, res) => {
  const { name, email, password } = req.body;
  const agentExists = await Agent.findOne({ email });

  if (agentExists) return res.status(400).json({ message: 'Agent already exists'});

  const agent = await Agent.create({ name, email, password });

  if (agent) {
    res.status(201).json({
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      token: generateToken(agent._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid agent data' });
  }
};

exports.authAgent = async (req, res) => {
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
