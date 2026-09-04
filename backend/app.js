const express = require('express');
const cors = require('cors');
const path = require('path');

const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS is permissive for local development, but production must use an
// explicit comma-separated allow-list of the deployed frontend origins.
const corsOrigin = process.env.CORS_ORIGIN;
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = corsOrigin
  ? corsOrigin.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // Non-browser requests (health checks, server-to-server calls, and local
    // CLI tests) do not send an Origin header and should remain usable.
    if (!origin) return callback(null, true);
    if (!isProduction && allowedOrigins.length === 0) return callback(null, true);
    return callback(null, allowedOrigins.includes(origin));
  },
}));

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
    message: 'AirStay API is running',
  });
});

// Error handler (must be after all routes)
app.use(errorHandler);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

module.exports = app;
