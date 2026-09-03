const Accommodation = require('../models/Accommodation');
const AppError = require('../utils/AppError');

/**
 * Escape regex special characters so user input can't be used to build
 * an unintended or catastrophic regular expression.
 * @param {string} str
 * @returns {string}
 */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * @desc    Get all accommodations, optionally filtered by location, price
 *          range, property type, minimum guest capacity, minimum rating,
 *          and/or amenities
 * @route   GET /api/accommodations
 * @access  Public
 */
const getAccommodations = async (req, res, next) => {
  try {
    const { location, minPrice, maxPrice, type, guests, minRating, amenities } = req.query;
    const filter = {};

    if (location) {
      filter.location = new RegExp(escapeRegex(location), 'i');
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && !Number.isNaN(Number(minPrice))) filter.price.$gte = Number(minPrice);
      if (maxPrice && !Number.isNaN(Number(maxPrice))) filter.price.$lte = Number(maxPrice);
      if (Object.keys(filter.price).length === 0) delete filter.price;
    }

    if (type) {
      filter.type = new RegExp(`^${escapeRegex(type)}$`, 'i');
    }

    if (guests && !Number.isNaN(Number(guests))) {
      filter.guests = { $gte: Number(guests) };
    }

    if (minRating && !Number.isNaN(Number(minRating))) {
      filter.rating = { $gte: Number(minRating) };
    }

    if (amenities) {
      const requested = Array.isArray(amenities) ? amenities : amenities.split(',');
      const cleaned = requested.map((a) => a.trim()).filter(Boolean);
      if (cleaned.length > 0) filter.amenities = { $all: cleaned };
    }

    const accommodations = await Accommodation.find(filter).populate('host', 'username');

    res.status(200).json({
      status: 'success',
      count: accommodations.length,
      data: accommodations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single accommodation by ID
 * @route   GET /api/accommodations/:id
 * @access  Public
 */
const getAccommodation = async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id).populate('host', 'username email');

    if (!accommodation) {
      return next(new AppError('Accommodation not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: accommodation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new accommodation listing
 * @route   POST /api/accommodations
 * @access  Private (Host/Admin)
 */
const createAccommodation = async (req, res, next) => {
  try {
    const accommodationData = {
      ...req.body,
      host: req.user._id,
    };

    if (typeof accommodationData.amenities === 'string') {
      accommodationData.amenities = JSON.parse(accommodationData.amenities);
    }

    if (req.files && req.files.length > 0) {
      accommodationData.images = req.files.map((file) => file.filename);
    }

    const accommodation = await Accommodation.create(accommodationData);

    res.status(201).json({
      status: 'success',
      data: accommodation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update accommodation listing
 * @route   PUT /api/accommodations/:id
 * @access  Private (Host/Admin)
 */
const updateAccommodation = async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return next(new AppError('Accommodation not found', 404));
    }

    if (
      accommodation.host.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(new AppError('Not authorized to update this accommodation', 403));
    }

    const updateData = { ...req.body };
    if (typeof updateData.amenities === 'string') {
      updateData.amenities = JSON.parse(updateData.amenities);
    }
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.filename);
    }

    const updated = await Accommodation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete accommodation listing
 * @route   DELETE /api/accommodations/:id
 * @access  Private (Host/Admin)
 */
const deleteAccommodation = async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return next(new AppError('Accommodation not found', 404));
    }

    if (
      accommodation.host.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(new AppError('Not authorized to delete this accommodation', 403));
    }

    await Accommodation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Accommodation removed',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAccommodations,
  getAccommodation,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
};
