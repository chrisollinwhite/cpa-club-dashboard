import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const TOKEN_EXPIRY = '7d'; // 7 days

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Generate JWT token
export const generateToken = (memberId, email, isAdmin) => {
  return jwt.sign(
    { 
      id: memberId, 
      email,
      isAdmin: Boolean(isAdmin)
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Generate random session token
export const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Calculate expiry date
export const getExpiryDate = (days = 7) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isValidPassword = (password) => {
  // At least 8 characters
  return password && password.length >= 8;
};

