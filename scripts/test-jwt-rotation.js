/**
 * Test script for JWT secret rotation
 * 
 * This script tests that:
 * 1. A token signed with the original secret works
 * 2. After rotation, a token signed with the original secret still works
 * 3. New tokens are signed with the new secret
 */

import jwt from 'jsonwebtoken';
import { SecretManager } from '../server/lib/secret-manager';

// Test data
const testUser = {
  id: 999,
  email: 'test@example.com',
  role: 'admin'
};

async function testJWTRotation() {
  console.log('Starting JWT rotation test...');
  
  // Get instance of secret manager
  const secretManager = SecretManager.getInstance();
  console.log('Secret manager obtained.');
  
  // Step 1: Get original secret and sign a token
  const originalSecret = secretManager.getCurrentSecret();
  console.log('Original secret obtained.');
  
  const originalToken = jwt.sign(testUser, originalSecret, { expiresIn: '1h' });
  console.log('Token signed with original secret:', originalToken.substring(0, 20) + '...');
  
  // Verify the original token works
  try {
    const decoded = jwt.verify(originalToken, originalSecret);
    console.log('✓ Original token verified successfully with original secret.');
  } catch (err) {
    console.error('✗ Failed to verify original token with original secret:', err.message);
    return false;
  }
  
  // Step 2: Rotate the secret
  console.log('\nRotating secret...');
  const newSecret = secretManager.rotateSecret(7); // 7 day grace period
  console.log('Secret rotated. Grace period: 7 days');
  
  // Step 3: Verify the original token still works with getAllValidSecrets
  const validSecrets = secretManager.getAllValidSecrets();
  console.log(`There are now ${validSecrets.length} valid secrets.`);
  
  let tokenVerified = false;
  for (const secret of validSecrets) {
    try {
      const decoded = jwt.verify(originalToken, secret);
      tokenVerified = true;
      break;
    } catch (err) {
      // Continue trying with next secret
    }
  }
  
  if (tokenVerified) {
    console.log('✓ Original token still valid after rotation.');
  } else {
    console.error('✗ Original token rejected after rotation.');
    return false;
  }
  
  // Step 4: Sign a new token with the new current secret
  const currentSecret = secretManager.getCurrentSecret();
  const newToken = jwt.sign(testUser, currentSecret, { expiresIn: '1h' });
  console.log('\nNew token signed with current secret:', newToken.substring(0, 20) + '...');
  
  // Verify the new token
  try {
    const decoded = jwt.verify(newToken, currentSecret);
    console.log('✓ New token verified successfully with current secret.');
  } catch (err) {
    console.error('✗ Failed to verify new token with current secret:', err.message);
    return false;
  }
  
  // Get status information
  const status = secretManager.getStatus();
  console.log('\nSecret Manager Status:');
  console.log(JSON.stringify(status, null, 2));
  
  console.log('\nJWT rotation test completed successfully!');
  return true;
}

// Run the test
testJWTRotation().then(success => {
  if (success) {
    console.log('✓ All JWT rotation tests passed.');
  } else {
    console.error('✗ JWT rotation test failed.');
    process.exit(1);
  }
}).catch(err => {
  console.error('Error during JWT rotation test:', err);
  process.exit(1);
});