const express = require('express');
const {
  createIntel,
  getMyIntel,
  updateIntel,
  deleteIntel
} = require('../controllers/intelController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, createIntel)
  .get(protect, getMyIntel);

router.route('/:id')
  .put(protect, updateIntel)
  .delete(protect, deleteIntel);

module.exports = router;
