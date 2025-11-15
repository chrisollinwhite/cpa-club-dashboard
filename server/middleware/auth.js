import { sessionDB } from '../models/database.js';

// Authenticate request using session token from cookie
export const authenticate = (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.session_token;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Verify token in database
    const session = sessionDB.findByToken(token);

    if (!session) {
      res.clearCookie('session_token');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired session' 
      });
    }

    // Check if member is active
    if (session.status !== 'active') {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is inactive' 
      });
    }

    // Attach member info to request
    req.member = {
      id: session.member_id,
      email: session.email,
      name: session.name,
      isAdmin: Boolean(session.is_admin)
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

// Require admin privileges
export const requireAdmin = (req, res, next) => {
  if (!req.member || !req.member.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin privileges required' 
    });
  }
  next();
};

// Optional authentication (doesn't fail if not authenticated)
export const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies.session_token;

    if (token) {
      const session = sessionDB.findByToken(token);
      if (session && session.status === 'active') {
        req.member = {
          id: session.member_id,
          email: session.email,
          name: session.name,
          isAdmin: Boolean(session.is_admin)
        };
      }
    }
  } catch (error) {
    console.error('Optional auth error:', error);
  }
  
  next();
};

