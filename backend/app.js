require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const checkoutRoute = require('./routes/checkoutRoute');
const authRoutes = require('./routes/authRoutes');
require('./config/passport');

const app = express();

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== CORS =====
const allowedOrigins = [
  'http://localhost:3000',               // frontend in development
  'https://ai-video-generation-mu.vercel.app' // frontend in production (no trailing slash)
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ===== Middleware =====
app.use(cookieParser());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// ===== Passport =====
app.use(passport.initialize());
app.use(passport.session());

// ===== Routes =====
app.get('/', (req, res) => res.send('API is running'));
app.use('/api', checkoutRoute);
app.use('/api/auth', authRoutes);

// ===== Error Handler for CORS =====
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS Error: Access Denied' });
  }
  next(err);
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
