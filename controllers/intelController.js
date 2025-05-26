const Intel = require('../models/Intel');

const createIntel = async (req, res) => {
  const { agentId, title, description, location } = req.body;
  const intel = new Intel({ title, description, location, agentId });
  const created = await intel.save();
  res.status(201).json(created);
};

const getAllIntel = async (req, res) => {
  const intels = await Intel.find({ }, 'title details location');
  res.json(intels);
};

const getAgentIntel = async (req, res) => {
  const agentId = req.params.agentId || req.agent._id;
  const intel = await Intel.find({ agentId });
  res.json(intel);
};

const updateIntel = async (req, res) => {
  try {
    const intel = await Intel.findById(req.params.id);

    if (intel && intel.agentId.toString() === req.agent._id.toString()) {
      intel.title = req.body.title || intel.title;
      intel.description = req.body.description || intel.description;
      intel.location = req.body.location || intel.location;
      const updated = await intel.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Intel not found or unauthorized' });
    }
  } catch (error) {
      res.status(500).json({message: `Server Error: ${error.message}`})
    }
};

const deleteIntel = async (req, res) => {
  const intel = await Intel.findById(req.params.id);
  if (intel && intel.agentId.toString() === req.agent._id.toString()) {
    await intel.remove();
    res.json({ message: 'Intel removed' });
  } else {
    res.status(404).json({ message: 'Intel not found or unauthorized' });
  }
};

module.exports = {
  createIntel,
  getAllIntel,
  getAgentIntel,
  updateIntel,
  deleteIntel
}