import { sql } from '@vercel/postgres';

// Initialize database tables
export async function initDatabase() {
  try {
    // Create members table
    await sql`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `;

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_members_email ON members(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_member_id ON sessions(member_id)`;

    console.log('✅ Database initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, error: error.message };
  }
}

// Member operations
export const memberDB = {
  // Create new member
  create: async (email, passwordHash, name, isAdmin = false) => {
    const result = await sql`
      INSERT INTO members (email, password_hash, name, is_admin)
      VALUES (${email}, ${passwordHash}, ${name}, ${isAdmin})
      RETURNING id
    `;
    return result.rows[0];
  },

  // Find member by email
  findByEmail: async (email) => {
    const result = await sql`
      SELECT * FROM members WHERE email = ${email}
    `;
    return result.rows[0];
  },

  // Find member by ID
  findById: async (id) => {
    const result = await sql`
      SELECT * FROM members WHERE id = ${id}
    `;
    return result.rows[0];
  },

  // Get all members
  getAll: async () => {
    const result = await sql`
      SELECT id, email, name, status, is_admin, created_at, last_login 
      FROM members 
      ORDER BY created_at DESC
    `;
    return result.rows;
  },

  // Update last login
  updateLastLogin: async (id) => {
    await sql`
      UPDATE members 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = ${id}
    `;
  },

  // Update member status
  updateStatus: async (id, status) => {
    await sql`
      UPDATE members 
      SET status = ${status} 
      WHERE id = ${id}
    `;
  },

  // Update password
  updatePassword: async (id, passwordHash) => {
    await sql`
      UPDATE members 
      SET password_hash = ${passwordHash} 
      WHERE id = ${id}
    `;
  },

  // Delete member
  delete: async (id) => {
    await sql`DELETE FROM members WHERE id = ${id}`;
  }
};

// Session operations
export const sessionDB = {
  // Create new session
  create: async (memberId, token, expiresAt) => {
    const result = await sql`
      INSERT INTO sessions (member_id, token, expires_at)
      VALUES (${memberId}, ${token}, ${expiresAt})
      RETURNING id
    `;
    return result.rows[0];
  },

  // Find session by token
  findByToken: async (token) => {
    const result = await sql`
      SELECT s.*, m.email, m.name, m.is_admin, m.status
      FROM sessions s
      JOIN members m ON s.member_id = m.id
      WHERE s.token = ${token} AND s.expires_at > CURRENT_TIMESTAMP
    `;
    return result.rows[0];
  },

  // Delete session
  delete: async (token) => {
    await sql`DELETE FROM sessions WHERE token = ${token}`;
  },

  // Delete expired sessions
  deleteExpired: async () => {
    await sql`DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP`;
  },

  // Delete all sessions for a member
  deleteByMemberId: async (memberId) => {
    await sql`DELETE FROM sessions WHERE member_id = ${memberId}`;
  }
};

