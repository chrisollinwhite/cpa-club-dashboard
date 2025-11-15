import { initDatabase, memberDB } from '../lib/db.js';
import { hashPassword } from '../lib/auth.js';

async function initialize() {
  try {
    console.log('🔄 Initializing Vercel Postgres database...');
    
    // Initialize tables
    const result = await initDatabase();
    
    if (!result.success) {
      console.error('❌ Failed to initialize database:', result.error);
      process.exit(1);
    }

    console.log('✅ Database tables created');

    // Check if admin exists
    const adminEmail = 'admin@fundinginsidersshow.com';
    const existingAdmin = await memberDB.findByEmail(adminEmail);

    if (existingAdmin) {
      console.log('ℹ️  Admin account already exists');
    } else {
      // Create admin account
      const adminPassword = await hashPassword('CPA100K2025!');
      await memberDB.create(
        adminEmail,
        adminPassword,
        'Admin User',
        true
      );
      console.log('✅ Admin account created');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password: CPA100K2025!');
    }

    // Check if test member exists
    const testEmail = 'chris@fundinginsidersshow.com';
    const existingTest = await memberDB.findByEmail(testEmail);

    if (existingTest) {
      console.log('ℹ️  Test member already exists');
    } else {
      // Create test member
      const testPassword = await hashPassword('TestPass123!');
      await memberDB.create(
        testEmail,
        testPassword,
        'Chris White',
        false
      );
      console.log('✅ Test member created');
      console.log('📧 Email:', testEmail);
      console.log('🔑 Password: TestPass123!');
    }

    console.log('\n🎉 Database initialization complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Initialization error:', error);
    process.exit(1);
  }
}

initialize();

