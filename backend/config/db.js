const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

const startMemoryMongo = async () => {
  memoryServer = await MongoMemoryServer.create();
  return memoryServer.getUri();
};

const connectWithFallback = async () => {
  const configuredUri = process.env.MONGO_URI;

  if (configuredUri) {
    try {
      const conn = await mongoose.connect(configuredUri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (primaryError) {
      if (process.env.NODE_ENV === 'production') {
        throw primaryError;
      }

      console.warn(
        'Primary MongoDB connection failed; retrying with in-memory MongoDB fallback.',
        primaryError.message
      );
    }
  }

  const fallbackUri = await startMemoryMongo();
  const conn = await mongoose.connect(fallbackUri);
  console.log(`MongoDB Connected (fallback): ${conn.connection.host}`);
  return conn;
};

/**
 * Connect to MongoDB Atlas when configured, but fall back to a local in-memory
 * database in non-production environments when the configured atlas host is not
 * reachable from the current runtime.
 */
const connectDB = async () => {
  try {
    return await connectWithFallback();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
