import { memberDB } from './models/database.js';
import { hashPassword } from './utils/auth.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Check if admin already exists
    const existingAdmin = memberDB.findByEmail('admin@fundinginsidersshow.com');
    
    if (existingAdmin) {
      console.log('✅ Admin account already exists');
      console.log('📧 Email: admin@fundinginsidersshow.com');
      return;
    }

    // Create admin account
    const adminPassword = 'CPA100K2025!'; // Change this in production
    const passwordHash = await hashPassword(adminPassword);

    memberDB.create(
      'admin@fundinginsidersshow.com',
      passwordHash,
      'Admin User',
      true // isAdmin
    );

    console.log('✅ Admin account created successfully!');
    console.log('');
    console.log('📧 Email: admin@fundinginsidersshow.com');
    console.log('🔑 Password: CPA100K2025!');
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('');

    // Create test member account
    const testPassword = 'TestPass123!';
    const testPasswordHash = await hashPassword(testPassword);

    memberDB.create(
      'chris@fundinginsidersshow.com',
      testPasswordHash,
      'Chris White',
      false // not admin
    );

    console.log('✅ Test member account created!');
    console.log('');
    console.log('📧 Email: chris@fundinginsidersshow.com');
    console.log('🔑 Password: TestPass123!');
    console.log('');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();

