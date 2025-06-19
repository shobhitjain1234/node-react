const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate JWT token
const generateJWT = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE, // 1 hour expiration (from .env)
  });
};

// Verify JWT token
const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = { generateJWT, verifyJWT };
