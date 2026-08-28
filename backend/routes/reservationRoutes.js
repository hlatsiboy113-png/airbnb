const express = require('express');
const router = express.Router();
const { authMiddleware, requireHost } = require('../middleware/auth');
const {
  createReservation,
  getUserReservations,
  getHostReservations,
  deleteReservation,
} = require('../controllers/reservationController');

router.post('/', authMiddleware, createReservation);
router.get('/user', authMiddleware, getUserReservations);
router.get('/host', authMiddleware, requireHost, getHostReservations);
router.delete('/:id', authMiddleware, deleteReservation);

module.exports = router;
