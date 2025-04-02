/**
 * JWT Configuration Verification Script
 * 
 * This script helps verify that the JWT functions are working correctly
 * by attempting to create and verify a test token.
 * 
 * Usage:
 * - Set your database connection info in the DB_CONFIG object
 * - Run with: node verify_jwt_config.js
 */

const { Pool } = require('pg');

// Update these settings to match your database configuration
const DB_CONFIG = {
  user: 'postgres',
  host: 'localhost',
  database: 'prettygood',  // change to your database name
  password: 'postgres',   // change to your password
  port: 5432,
};

async function verifyJwtConfig() {
  const pool = new Pool(DB_CONFIG);
  
  try {
    console.log('🔑 Checking JWT configuration...');

    // Check if the JWT secret is set properly
    const secretRes = await pool.query(`
      SELECT auth.get_jwt_secret() IS NOT NULL AS has_secret,
             LENGTH(auth.get_jwt_secret()) AS secret_length
    `);
    
    const { has_secret, secret_length } = secretRes.rows[0];
    
    if (!has_secret) {
      console.error('❌ ERROR: JWT secret is not set or is NULL');
      console.log('   Please set your JWT secret with:');
      console.log('   ALTER DATABASE your_database_name SET app.jwt_secret = \'your_secret_here\';');
      return;
    }
    
    console.log(`✅ JWT secret is configured (length: ${secret_length} characters)`);
    
    // Create a test token
    console.log('\n🔑 Testing token generation...');
    const testUser = await pool.query(`
      SELECT id FROM prettygood.users LIMIT 1
    `);
    
    if (testUser.rows.length === 0) {
      console.error('❌ No users found in the database to test with');
      return;
    }
    
    const userId = testUser.rows[0].id;
    console.log(`📝 Found test user with ID: ${userId}`);
    
    // Check if user is an artist to determine role
    const artistCheck = await pool.query(`
      SELECT EXISTS (SELECT 1 FROM prettygood.artists WHERE id = $1) AS is_artist
    `, [userId]);
    
    const role = artistCheck.rows[0].is_artist ? 'artist' : 'user';
    console.log(`📝 User role determined as: ${role}`);
    
    // Generate a test token
    const genTokenRes = await pool.query(`
      SELECT auth.generate_jwt($1, $2, 3600) AS token
    `, [userId, role]);
    
    const testToken = genTokenRes.rows[0].token;
    
    if (!testToken) {
      console.error('❌ Failed to generate test token');
      return;
    }
    
    console.log(`✅ Successfully generated test token`);
    console.log(`📝 Token: ${testToken}`);
    
    // Verify the test token
    console.log('\n🔑 Testing token verification...');
    try {
      const verifyRes = await pool.query(`
        SELECT * FROM auth.verify_jwt($1)
      `, [testToken]);
      
      console.log(`✅ Successfully verified test token`);
      console.log(`📝 Decoded token: ${JSON.stringify(verifyRes.rows[0], null, 2)}`);
    } catch (error) {
      console.error('❌ Failed to verify test token');
      console.error(`   Error: ${error.message}`);
      return;
    }
    
    // Test refresh token function
    console.log('\n🔄 Testing token refresh...');
    try {
      const refreshRes = await pool.query(`
        SELECT prettygood.refresh_token($1) AS new_token
      `, [testToken]);
      
      const newToken = refreshRes.rows[0].new_token;
      
      if (!newToken) {
        console.error('❌ Failed to refresh test token - no token returned');
        return;
      }
      
      console.log(`✅ Successfully refreshed token`);
      console.log(`📝 New token: ${newToken}`);
      
      // Final verification
      console.log('\n✨ JWT configuration is working correctly');
      console.log('   Your authentication system should now be able to refresh tokens');
    } catch (error) {
      console.error('❌ Failed to refresh test token');
      console.error(`   Error: ${error.message}`);
      return;
    }
    
  } catch (error) {
    console.error('❌ Error verifying JWT configuration:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  } finally {
    await pool.end();
  }
}

// Run the verification
verifyJwtConfig().catch(err => {
  console.error('Failed to verify JWT configuration:', err);
  process.exit(1);
});
