import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const db = new Database(join(__dirname, './data/members.db'));

console.log('Adding referral_link column to members table...');

try {
  // Add the column
  db.exec('ALTER TABLE members ADD COLUMN referral_link TEXT');
  console.log('✅ Column added successfully!');
  
  // Update Chris White's referral link
  const stmt = db.prepare('UPDATE members SET referral_link = ? WHERE email = ?');
  stmt.run('https://link.myfundingmachine.com/l/w8jTTOnQ5', 'preeminentroofer@gmail.com' );
  console.log('✅ Chris White\'s referral link updated!');
  
  // Verify
  const member = db.prepare('SELECT email, referral_link FROM members WHERE email = ?').get('preeminentroofer@gmail.com');
  console.log('✅ Verification:', member);
  
} catch (error) {
  if (error.message.includes('duplicate column name')) {
    console.log('⚠️  Column already exists, updating Chris White\'s link...');
    const stmt = db.prepare('UPDATE members SET referral_link = ? WHERE email = ?');
    stmt.run('https://link.myfundingmachine.com/l/w8jTTOnQ5', 'preeminentroofer@gmail.com' );
    console.log('✅ Updated!');
  } else {
    console.error('❌ Error:', error.message);
  }
}

db.close();
