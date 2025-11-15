import { memberDB, sessionDB } from '../../lib/db.js';
import { 
  comparePassword, 
  generateSessionToken, 
  getExpiryDate,
  isValidEmail,
  createCookie
} from '../../lib/auth.js';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

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
    const member = await memberDB.findByEmail(email.toLowerCase());

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

    await sessionDB.create(member.id, token, expiresAt);

    // Update last login
    await memberDB.updateLastLogin(member.id);

    // Set cookie
    const cookie = createCookie('session_token', token, 7 * 24 * 60 * 60);
    res.setHeader('Set-Cookie', cookie);

    // Return success
    res.status(200).json({
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
}

