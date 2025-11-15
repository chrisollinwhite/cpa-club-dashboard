import { sessionDB } from '../../lib/db.js';
import { parseCookies } from '../../lib/auth.js';

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.session_token;

    if (!token) {
      return res.status(200).json({ 
        success: true, 
        authenticated: false 
      });
    }

    const session = await sessionDB.findByToken(token);

    if (!session || session.status !== 'active') {
      return res.status(200).json({ 
        success: true, 
        authenticated: false 
      });
    }

    res.status(200).json({
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
    res.status(200).json({ 
      success: true, 
      authenticated: false 
    });
  }
}

