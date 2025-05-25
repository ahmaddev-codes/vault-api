const express = require('express');
const { registerAgent, authAgent, getAllAgents } = require('../controllers/agentController');
const router = express.Router();

router.get('/', getAllAgents)
router.post('/register', registerAgent);
router.post('/login', authAgent);

module.exports = router;
