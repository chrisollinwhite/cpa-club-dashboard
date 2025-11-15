import express from 'express';
import { memberDB, sessionDB } from '../models/database.js';
import { 
  hashPassword, 
  comparePassword, 
  generateSessionToken, 
  getExpiryDate,
  isValidEmail,
  isValidPassword 
} from '../utils/auth.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Find member
    const member = memberDB.findByEmail(email.toLowerCase());

    if (!member) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check if account is active
    if (member.status !== 'active') {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is inactive. Please contact support.' 
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, member.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Create session
    const token = generateSessionToken();
    const expiresAt = getExpiryDate(7);

    sessionDB.create(member.id, token, expiresAt);

    // Update last login
    memberDB.updateLastLogin(member.id);

    // Set cookie
    res.cookie('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return success
    res.json({
      success: true,
      message: 'Login successful',
      member: {
        id: member.id,
        email: member.email,
        name: member.name,
        isAdmin: Boolean(member.is_admin)
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during login' 
    });
  }
});

// Logout
router.post('/logout', authenticate, (req, res) => {
  try {
    const token = req.cookies.session_token;
    
    if (token) {
      sessionDB.delete(token);
    }

    res.clearCookie('session_token');

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during logout' 
    });
  }
});

// Get current member
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    member: req.member
  });
});

// Check auth status
router.get('/status', (req, res) => {
  try {
    const token = req.cookies.session_token;

    if (!token) {
      return res.json({ 
        success: true, 
        authenticated: false 
      });
    }

    const session = sessionDB.findByToken(token);

    if (!session || session.status !== 'active') {
      res.clearCookie('session_token');
      return res.json({ 
        success: true, 
        authenticated: false 
      });
    }

    res.json({
      success: true,
      authenticated: true,
      member: {
        id: session.member_id,
        email: session.email,
        name: session.name,
        isAdmin: Boolean(session.is_admin)
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.json({ 
      success: true, 
      authenticated: false 
    });
  }
});

export default router;

