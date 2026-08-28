const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');
const AppError = require('../utils/AppError');

/**
 * @desc    Create a new reservation with cost calculation
 * @route   POST /api/reservations
 * @access  Private
 */
const createReservation = async (req, res, next) => {
  try {
    const { accommodation: accommodationId, checkIn, checkOut, guests } = req.body;

    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return next(new AppError('Accommodation not found', 404));
    }

    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      return next(new AppError('Check-out must be after check-in', 400));
    }

    const baseCost = accommodation.price * nights;
    const totalCost =
      baseCost -
      accommodation.weeklyDiscount +
      accommodation.cleaningFee +
      accommodation.serviceFee +
      accommodation.occupancyTaxes;

    const reservation = await Reservation.create({
      accommodation: accommodationId,
      user: req.user._id,
      host: accommodation.host,
      checkIn,
      checkOut,
      guests,
      totalCost,
    });

    const populated = await reservation.populate('accommodation user');

    res.status(201).json({
      status: 'success',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reservations for logged-in user
 * @route   GET /api/reservations/user
 * @access  Private
 */
const getUserReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('accommodation', 'title location price images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reservations for host's properties
 * @route   GET /api/reservations/host
 * @access  Private (Host)
 */
const getHostReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ host: req.user._id })
      .populate('accommodation', 'title location price images')
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel/delete a reservation
 * @route   DELETE /api/reservations/:id
 * @access  Private (User/Host/Admin)
 */
const deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return next(new AppError('Reservation not found', 404));
    }

    if (
      reservation.user.toString() !== req.user._id.toString() &&
      reservation.host.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(new AppError('Not authorized to cancel this reservation', 403));
    }

    await Reservation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Reservation cancelled',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReservation,
  getUserReservations,
  getHostReservations,
  deleteReservation,
};
