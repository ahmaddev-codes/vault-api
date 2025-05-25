const Intel = require('../models/Intel');

exports.createIntel = async (req, res) => {
  const { title, description, location } = req.body;
  const intel = new Intel({ title, description, location, agentId: req.agent._id });
  const created = await intel.save();
  res.status(201).json(created);
};

exports.getMyIntel = async (req, res) => {
  const intel = await Intel.find({ agentId: req.agent._id });
  res.json(intel);
};

exports.updateIntel = async (req, res) => {
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
};

exports.deleteIntel = async (req, res) => {
  const intel = await Intel.findById(req.params.id);
  if (intel && intel.agentId.toString() === req.agent._id.toString()) {
    await intel.remove();
    res.json({ message: 'Intel removed' });
  } else {
    res.status(404).json({ message: 'Intel not found or unauthorized' });
  }
};
