import { memberDB, sessionDB } from '../../../lib/db.js';
import { parseCookies, hashPassword } from '../../../lib/auth.js';

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

    const { id } = req.query;
    const memberId = parseInt(id);

    if (!memberId || isNaN(memberId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid member ID' 
      });
    }

    // PATCH - Update member
    if (req.method === 'PATCH') {
      const { action, status, password } = req.body;

      if (action === 'status' && status) {
        // Don't allow deactivating yourself
        if (memberId === authCheck.memberId) {
          return res.status(400).json({ 
            success: false, 
            message: 'Cannot change your own status' 
          });
        }

        await memberDB.updateStatus(memberId, status);

        return res.status(200).json({
          success: true,
          message: 'Member status updated'
        });
      }

      if (action === 'password' && password) {
        if (password.length < 8) {
          return res.status(400).json({ 
            success: false, 
            message: 'Password must be at least 8 characters' 
          });
        }

        const passwordHash = await hashPassword(password);
        await memberDB.updatePassword(memberId, passwordHash);

        // Delete all sessions for this member
        await sessionDB.deleteByMemberId(memberId);

        return res.status(200).json({
          success: true,
          message: 'Password reset successfully'
        });
      }

      return res.status(400).json({ 
        success: false, 
        message: 'Invalid action' 
      });
    }

    // DELETE - Delete member
    if (req.method === 'DELETE') {
      // Don't allow deleting yourself
      if (memberId === authCheck.memberId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot delete your own account' 
        });
      }

      await memberDB.delete(memberId);

      return res.status(200).json({
        success: true,
        message: 'Member deleted successfully'
      });
    }

    // Method not allowed
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });

  } catch (error) {
    console.error('Admin member action error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred' 
    });
  }
}

