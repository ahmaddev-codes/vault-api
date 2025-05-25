const express = require('express');
const { registerAgent, authAgent } = require('../controllers/agentController');
const router = express.Router();

router.post('/register', registerAgent);
router.post('/login', authAgent);

module.exports = router;
