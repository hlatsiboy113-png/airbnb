const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const { ensureDefaultUsers } = require('../controllers/userController');
const { ensureDefaultAccommodations } = require('../utils/defaultAccommodations');

const seed = async () => {
  await connectDB();
  await ensureDefaultUsers();

  const host = await User.findOne({ email: 'jane@example.com' });
  await ensureDefaultAccommodations(host._id);
  console.log('Default accommodations seeded successfully.');
  process.exit(0);
};

seed().catch((error) => {
  console.error(`Seeding failed: ${error.message}`);
  process.exit(1);
});
