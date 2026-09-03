const dotenv = require('dotenv');
dotenv.config();

// Workaround for environments where the default resolver can't handle
// mongodb+srv DNS lookups (seen in some local/sandboxed dev setups).
// Scoped to non-production so it never overrides a working resolver on
// the actual host (e.g. Render), where it isn't needed and could
// introduce an unnecessary external dependency on 8.8.8.8.
if (process.env.NODE_ENV !== 'production') {
  const dns = require('dns');
  dns.setServers(['8.8.8.8']);
}

const app = require('./app');
const connectDB = require('./config/db');
const User = require('./models/User');
const { ensureDefaultUsers } = require('./controllers/userController');
const { ensureDefaultAccommodations } = require('./utils/defaultAccommodations');

const startServer = async () => {
  await connectDB();
  await ensureDefaultUsers();
  if (process.env.NODE_ENV !== 'production') {
    const host = await User.findOne({ email: 'jane@example.com' });
    if (host) await ensureDefaultAccommodations(host._id);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
