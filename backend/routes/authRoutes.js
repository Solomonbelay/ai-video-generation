const express = require('express');
const passport = require('passport');
const { registerUser, loginUser, googleAuthCallback, getCurrentUser } = require('../controllers/authController');

const router = express.Router();

// Email/password login/signup
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', getCurrentUser); // ✅ fetch current user

// Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleAuthCallback
);

module.exports = router;
