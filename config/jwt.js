// config/jwt.js
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (payload, options = {}) => {
  const defaultOptions = {
    expiresIn: process.env.JWT_EXPIRE || '30d',
    issuer: process.env.JWT_ISSUER || 'nextin-vision',
  };

  const tokenOptions = { ...defaultOptions, ...options };

  return jwt.sign(payload, process.env.JWT_SECRET, tokenOptions);
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Decode JWT token without verification (for expired tokens)
const decodeToken = (token) => {
  return jwt.decode(token, { complete: true });
};

// Generate refresh token
const generateRefreshToken = (payload) => {
  return generateToken(payload, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d',
  });
};

// Extract token from request headers
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  generateRefreshToken,
  extractTokenFromHeader
};