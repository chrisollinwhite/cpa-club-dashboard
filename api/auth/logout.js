import { sessionDB } from '../../lib/db.js';
import { parseCookies, clearCookie } from '../../lib/auth.js';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.session_token;
    
    if (token) {
      await sessionDB.delete(token);
    }

    // Clear cookie
    res.setHeader('Set-Cookie', clearCookie('session_token'));

    res.status(200).json({
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
}

