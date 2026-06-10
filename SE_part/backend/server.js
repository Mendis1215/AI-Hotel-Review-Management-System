const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Basic Route
app.get('/', (req, res) => {
  res.send('Y & I Villa API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
