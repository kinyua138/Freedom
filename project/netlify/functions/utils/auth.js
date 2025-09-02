const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
function generateToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
  } catch (error) {
    return null;
  }
}

// Hash password
async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Compare password
async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Extract token from Authorization header
function extractToken(headers) {
  const authHeader = headers.authorization || headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
function isValidPassword(password) {
  // At least 6 characters, contains letter and number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  return passwordRegex.test(password);
}

// Generate user avatar
function generateAvatar(name, email) {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);

  // Generate consistent color based on email
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  const backgroundColor = colors[Math.abs(hash) % colors.length];

  return {
    type: 'initials',
    initials,
    backgroundColor
  };
}

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  extractToken,
  isValidEmail,
  isValidPassword,
  generateAvatar
};
