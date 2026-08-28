const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authMiddleware, requireHost } = require('../middleware/auth');
const {
  getAccommodations,
  getAccommodation,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
} = require('../controllers/accommodationController');

router.get('/', getAccommodations);
router.get('/:id', getAccommodation);
router.post('/', authMiddleware, requireHost, upload.array('images', 5), createAccommodation);
router.put('/:id', authMiddleware, requireHost, upload.array('images', 5), updateAccommodation);
router.delete('/:id', authMiddleware, requireHost, deleteAccommodation);

module.exports = router;
