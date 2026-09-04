const express = require('express');
const router = express.Router();
const { authMiddleware, requireHost, requireAdmin } = require('../middleware/auth');
const {
  createReservation,
  updateReservation,
  getUserReservations,
  getAllReservations,
  getHostStats,
  getHostReservations,
  deleteReservation,
} = require('../controllers/reservationController');

router.post('/', authMiddleware, createReservation);
router.get('/', authMiddleware, requireAdmin, getAllReservations);
router.get('/user', authMiddleware, getUserReservations);
router.get('/host/stats', authMiddleware, requireHost, getHostStats);
router.get('/host', authMiddleware, requireHost, getHostReservations);
router.put('/:id', authMiddleware, updateReservation);
router.delete('/:id', authMiddleware, deleteReservation);

module.exports = router;
