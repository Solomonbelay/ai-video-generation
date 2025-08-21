// backend/controllers/authControll.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body; // include name

  try {
    console.log("➡️ Register attempt:", email);

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.warn("⚠️ User already exists:", email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed }); // store name

    console.log("✅ User registered:", newUser._id);

    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    console.error("❌ Registration error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("➡️ Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.warn("⚠️ Login failed, user not found:", email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("⚠️ Login failed, wrong password for:", email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("✅ Login successful for:", email);

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error("❌ Login error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const googleAuthCallback = (req, res) => {
  const user = req.user;
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.redirect(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard`);
};

const getCurrentUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ id: user._id, email: user.email, name: user.name }); // include name
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuthCallback,
  getCurrentUser,
};
