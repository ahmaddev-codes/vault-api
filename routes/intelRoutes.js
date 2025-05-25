const express = require('express');
const {
  createIntel,
  getAllIntel,
  getAgentIntel,
  updateIntel,
  deleteIntel
} = require('../controllers/intelController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, createIntel)
  .get(protect, getAllIntel);

  router.route('/:id')
  .get(protect, getAgentIntel)
  .put(protect, updateIntel)
  .delete(protect, deleteIntel);

module.exports = router;
