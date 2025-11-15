import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
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
  return password && password.length >= 8;
};

// Parse cookies from request
export const parseCookies = (cookieHeader) => {
  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
    });
  }
  return cookies;
};

// Create cookie string
export const createCookie = (name, value, maxAge) => {
  const isProduction = process.env.NODE_ENV === 'production';
  return `${name}=${value}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${isProduction ? '; Secure' : ''}`;
};

// Clear cookie string
export const clearCookie = (name) => {
  return `${name}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
};

