const express = require('express');
const cors = require('cors');
const path = require('path');

const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/accommodations', require('./routes/accommodationRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Airbnb API is running',
  });
});

// Error handler (must be after all routes)
app.use(errorHandler);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

module.exports = app;
