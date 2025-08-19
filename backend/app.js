require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const checkoutRoute= require ('./routes/checkoutRoute');
const authRoutes = require('./routes/authRoutes');
require('./config/passport');

const app = express();

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors({
  origin: [
    'http://localhost:3000',            // frontend in development
    'https://ai-video-generation-mu.vercel.app/' // frontend in production
  ],
  credentials: true,
}));



app.use(cookieParser());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/api", checkoutRoute);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
