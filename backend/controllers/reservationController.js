const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');
const AppError = require('../utils/AppError');

const calculateTotal = (accommodation, nights) => (
  (accommodation.price * nights)
  - (accommodation.weeklyDiscount || 0)
  + (accommodation.cleaningFee || 0)
  + (accommodation.serviceFee || 0)
  + (accommodation.occupancyTaxes || 0)
);

/**
 * @desc    Create a new reservation with server-side cost calculation
 * @route   POST /api/reservations
 * @access  Private
 */
const createReservation = async (req, res, next) => {
  try {
    const { accommodation: accommodationId, checkIn, checkOut, guests } = req.body;
    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) return next(new AppError('Accommodation not found', 404));
    if (Number(guests) < 1 || Number(guests) > accommodation.guests) {
      return next(new AppError(`This accommodation only accommodates up to ${accommodation.guests} guests`, 400));
    }
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000);
    if (nights <= 0) return next(new AppError('Check-out must be after check-in', 400));
    if (new Date(checkIn) <= new Date()) {
      return next(new AppError('Check-in must be in the future', 400));
    }

    const overlapping = await Reservation.findOne({
      accommodation: accommodationId,
      status: { $ne: 'cancelled' },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
    });
    if (overlapping) {
      return next(new AppError('Accommodation is already booked for the selected dates.', 400));
    }

    const reservation = await Reservation.create({
      accommodation: accommodationId,
      user: req.user._id,
      host: accommodation.host,
      checkIn,
      checkOut,
      guests,
      totalCost: calculateTotal(accommodation, nights),
    });
    const populated = await reservation.populate('accommodation user');
    res.status(201).json({ status: 'success', data: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an upcoming reservation's dates and/or guest count
 * @route   PUT /api/reservations/:id
 * @access  Private (reservation owner or administrator)
 */
const updateReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('accommodation');
    if (!reservation) return next(new AppError('Reservation not found', 404));
    if (reservation.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this reservation', 403));
    }
    if (new Date(reservation.checkIn) <= new Date()) {
      return next(new AppError('Reservations can only be changed before check-in', 400));
    }

    const checkIn = req.body.checkIn || reservation.checkIn;
    const checkOut = req.body.checkOut || reservation.checkOut;
    const guests = Number(req.body.guests || reservation.guests);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      return next(new AppError('Please provide valid check-in and check-out dates', 400));
    }
    if (checkInDate <= new Date()) {
      return next(new AppError('Reservations can only be changed before check-in', 400));
    }
    const nights = Math.ceil((checkOutDate - checkInDate) / 86400000);
    if (nights <= 0) return next(new AppError('Check-out must be after check-in', 400));
    if (guests < 1 || guests > reservation.accommodation.guests) {
      return next(new AppError(`This accommodation only accommodates up to ${reservation.accommodation.guests} guests`, 400));
    }

    const overlapping = await Reservation.findOne({
      _id: { $ne: reservation._id },
      accommodation: reservation.accommodation._id,
      status: { $ne: 'cancelled' },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });
    if (overlapping) {
      return next(new AppError('Accommodation is already booked for the selected dates.', 400));
    }

    reservation.checkIn = checkIn;
    reservation.checkOut = checkOut;
    reservation.guests = guests;
    reservation.totalCost = calculateTotal(reservation.accommodation, nights);
    const updated = await reservation.save();
    await updated.populate('accommodation user');
    res.status(200).json({ status: 'success', data: updated });
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
    res.status(200).json({ status: 'success', count: reservations.length, data: reservations });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all platform reservations for administrator oversight
 * @route   GET /api/reservations
 * @access  Private (Admin)
 */
const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({})
      .populate('accommodation', 'title location price images')
      .populate('user', 'username email')
      .populate('host', 'username email')
      .sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', count: reservations.length, data: reservations });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get summary metrics for the authenticated host
 * @route   GET /api/reservations/host/stats
 * @access  Private (Host)
 */
const getHostStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const hostFilter = { host: req.user._id };
    const [totalReservations, earnings, upcoming] = await Promise.all([
      Reservation.countDocuments(hostFilter),
      Reservation.aggregate([
        { $match: { host: req.user._id, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalCost' } } },
      ]),
      Reservation.countDocuments({ ...hostFilter, status: { $ne: 'cancelled' }, checkIn: { $gte: today } }),
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        totalReservations,
        totalEarnings: earnings[0]?.total || 0,
        upcomingReservations: upcoming,
      },
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
    res.status(200).json({ status: 'success', count: reservations.length, data: reservations });
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
    if (!reservation) return next(new AppError('Reservation not found', 404));
    if (reservation.user.toString() !== req.user._id.toString() && reservation.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to cancel this reservation', 403));
    }
    await Reservation.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', message: 'Reservation cancelled' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReservation, updateReservation, getUserReservations, getAllReservations, getHostStats, getHostReservations, deleteReservation };
