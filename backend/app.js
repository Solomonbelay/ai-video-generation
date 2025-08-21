require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const checkoutRoute = require('./routes/checkoutRoute'); // make sure the filename matches
const authRoutes = require('./routes/authRoutes');
require('./config/passport');

const app = express();

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== CORS =====
const allowedOrigins = [
  'http://localhost:3000',
  'https://ai-video-generation-ten.vercel.app'
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// ✅ FIXED: use regex instead of '*' for preflight
app.options(/.*/, cors(corsOptions));

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
  console.error('❌ Server error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// ===== Debug: list all registered routes =====
const listEndpoints = require('express-list-endpoints');
console.log("🔍 Registered routes:");
console.log(listEndpoints(app));

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
