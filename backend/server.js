require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const destinationRoutes = require('./routes/destinationRoutes');
const ecoRoutes = require('./routes/ecoRoutes');
const culturalRoutes = require('./routes/culturalRoutes');
const festivalRoutes = require('./routes/festivalRoutes');
const adminRoutes = require('./routes/adminRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Connect to MongoDB
connectDB();

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏛️ Bihar Tourism API is running',
    version: '1.0.0',
    endpoints: {
      destinations: '/api/destinations',
      ecotourism: '/api/ecotourism',
      cultural: '/api/cultural',
      festivals: '/api/festivals',
      admin: '/api/admin',
      recommendations: '/api/recommendations',
      itineraries: '/api/itineraries',
      weather: '/api/weather',
      bookings: '/api/bookings',
      notifications: '/api/notifications',
    },
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/destinations', destinationRoutes);
app.use('/api/ecotourism', ecoRoutes);
app.use('/api/cultural', culturalRoutes);
app.use('/api/festivals', festivalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
