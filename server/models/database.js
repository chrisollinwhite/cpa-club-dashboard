import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database
const db = new Database(join(__dirname, '../data/members.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const initDB = () => {
  // Members table
  db.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
    CREATE INDEX IF NOT EXISTS idx_sessions_member_id ON sessions(member_id);
  `);

  console.log('✅ Database initialized successfully');
};

// Member operations
export const memberDB = {
  // Create new member
  create: (email, passwordHash, name, isAdmin = false) => {
    const stmt = db.prepare(`
      INSERT INTO members (email, password_hash, name, is_admin)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(email, passwordHash, name, isAdmin ? 1 : 0);
  },

  // Find member by email
  findByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM members WHERE email = ?');
    return stmt.get(email);
  },

  // Find member by ID
  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM members WHERE id = ?');
    return stmt.get(id);
  },

  // Get all members
  getAll: () => {
    const stmt = db.prepare('SELECT id, email, name, status, is_admin, created_at, last_login FROM members ORDER BY created_at DESC');
    return stmt.all();
  },

  // Update last login
  updateLastLogin: (id) => {
    const stmt = db.prepare('UPDATE members SET last_login = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(id);
  },

  // Update member status
  updateStatus: (id, status) => {
    const stmt = db.prepare('UPDATE members SET status = ? WHERE id = ?');
    return stmt.run(status, id);
  },

  // Update password
  updatePassword: (id, passwordHash) => {
    const stmt = db.prepare('UPDATE members SET password_hash = ? WHERE id = ?');
    return stmt.run(passwordHash, id);
  },

  // Delete member
  delete: (id) => {
    const stmt = db.prepare('DELETE FROM members WHERE id = ?');
    return stmt.run(id);
  }
};

// Session operations
export const sessionDB = {
  // Create new session
  create: (memberId, token, expiresAt) => {
    const stmt = db.prepare(`
      INSERT INTO sessions (member_id, token, expires_at)
      VALUES (?, ?, ?)
    `);
    return stmt.run(memberId, token, expiresAt);
  },

  // Find session by token
  findByToken: (token) => {
    const stmt = db.prepare(`
      SELECT s.*, m.email, m.name, m.is_admin, m.status
      FROM sessions s
      JOIN members m ON s.member_id = m.id
      WHERE s.token = ? AND s.expires_at > CURRENT_TIMESTAMP
    `);
    return stmt.get(token);
  },

  // Delete session
  delete: (token) => {
    const stmt = db.prepare('DELETE FROM sessions WHERE token = ?');
    return stmt.run(token);
  },

  // Delete expired sessions
  deleteExpired: () => {
    const stmt = db.prepare('DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP');
    return stmt.run();
  },

  // Delete all sessions for a member
  deleteByMemberId: (memberId) => {
    const stmt = db.prepare('DELETE FROM sessions WHERE member_id = ?');
    return stmt.run(memberId);
  }
};

// Initialize database on import
initDB();

export default db;

