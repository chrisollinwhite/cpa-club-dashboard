import { createPool } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const pool = createPool({
    connectionString: process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL,
  });
  
  try {
    // Create members table
    await pool.sql`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Check if admin exists
    const existingAdmin = await pool.sql`
      SELECT * FROM members WHERE email = 'admin@fundinginsidersshow.com'
    `;

    if (existingAdmin.rows.length === 0) {
      // Create admin account
      const passwordHash = await bcrypt.hash('CPA100K2025!', 10);
      await pool.sql`
        INSERT INTO members (email, password_hash, full_name, is_admin, is_active)
        VALUES ('admin@fundinginsidersshow.com', ${passwordHash}, 'Admin User', true, true)
      `;
    }

    res.json({ 
      success: true, 
      message: 'Database initialized successfully',
      admin: 'admin@fundinginsidersshow.com'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
}
