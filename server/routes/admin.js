import express from 'express';
import { memberDB, sessionDB } from '../models/database.js';
import { 
  hashPassword, 
  isValidEmail, 
  isValidPassword 
} from '../utils/auth.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authenticate);
router.use(requireAdmin);

// Get all members
router.get('/members', (req, res) => {
  try {
    const members = memberDB.getAll();
    
    res.json({
      success: true,
      members: members.map(m => ({
        id: m.id,
        email: m.email,
        name: m.name,
        status: m.status,
        isAdmin: Boolean(m.is_admin),
        createdAt: m.created_at,
        lastLogin: m.last_login
      }))
    });

  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve members' 
    });
  }
});

// Create new member
router.post('/members', async (req, res) => {
  try {
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
        message: 'Password must be at least 8 characters long' 
      });
    }

    // Check if email already exists
    const existing = memberDB.findByEmail(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create member
    const result = memberDB.create(
      email.toLowerCase(), 
      passwordHash, 
      name,
      isAdmin || false
    );

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      member: {
        id: result.lastInsertRowid,
        email: email.toLowerCase(),
        name,
        isAdmin: Boolean(isAdmin)
      }
    });

  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create member' 
    });
  }
});

// Update member status
router.patch('/members/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status must be either "active" or "inactive"' 
      });
    }

    // Don't allow deactivating yourself
    if (parseInt(id) === req.member.id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot change your own status' 
      });
    }

    memberDB.updateStatus(id, status);

    // If deactivating, delete all sessions
    if (status === 'inactive') {
      sessionDB.deleteByMemberId(id);
    }

    res.json({
      success: true,
      message: 'Member status updated successfully'
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update member status' 
    });
  }
});

// Reset member password
router.patch('/members/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!isValidPassword(password)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters long' 
      });
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update password
    memberDB.updatePassword(id, passwordHash);

    // Delete all sessions for this member (force re-login)
    sessionDB.deleteByMemberId(id);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reset password' 
    });
  }
});

// Delete member
router.delete('/members/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow deleting yourself
    if (parseInt(id) === req.member.id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete your own account' 
      });
    }

    // Delete member (sessions will be deleted automatically due to foreign key)
    memberDB.delete(id);

    res.json({
      success: true,
      message: 'Member deleted successfully'
    });

  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete member' 
    });
  }
});

export default router;

