import { memberDB, sessionDB } from '../../lib/db.js';
import { parseCookies } from '../../lib/auth.js';
import { hashPassword, isValidEmail, isValidPassword } from '../../lib/auth.js';

// Check if user is admin
async function checkAdmin(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.session_token;

  if (!token) {
    return { authorized: false, message: 'Authentication required' };
  }

  const session = await sessionDB.findByToken(token);

  if (!session || session.status !== 'active') {
    return { authorized: false, message: 'Invalid or expired session' };
  }

  if (!session.is_admin) {
    return { authorized: false, message: 'Admin access required' };
  }

  return { authorized: true, memberId: session.member_id };
}

export default async function handler(req, res) {
  try {
    // Check admin authorization
    const authCheck = await checkAdmin(req);
    if (!authCheck.authorized) {
      return res.status(403).json({ 
        success: false, 
        message: authCheck.message 
      });
    }

    // GET - List all members
    if (req.method === 'GET') {
      const members = await memberDB.getAll();
      
      // Remove password hashes
      const sanitizedMembers = members.map(m => ({
        id: m.id,
        email: m.email,
        name: m.name,
        status: m.status,
        isAdmin: Boolean(m.is_admin),
        createdAt: m.created_at,
        lastLogin: m.last_login
      }));

      return res.status(200).json({
        success: true,
        members: sanitizedMembers
      });
    }

    // POST - Create new member
    if (req.method === 'POST') {
      const { email, password, name, isAdmin } = req.body;

      // Validate input
      if (!email || !password || !name) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email, password, and name are required' 
        });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid email format' 
        });
      }

      if (!isValidPassword(password)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Password must be at least 8 characters' 
        });
      }

      // Check if email already exists
      const existing = await memberDB.findByEmail(email.toLowerCase());
      if (existing) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already exists' 
        });
      }

      // Create member
      const passwordHash = await hashPassword(password);
      const result = await memberDB.create(
        email.toLowerCase(),
        passwordHash,
        name,
        Boolean(isAdmin)
      );

      return res.status(201).json({
        success: true,
        message: 'Member created successfully',
        member: {
          id: result.id,
          email: email.toLowerCase(),
          name: name
        }
      });
    }

    // Method not allowed
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });

  } catch (error) {
    console.error('Admin members error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred' 
    });
  }
}

