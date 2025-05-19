// This file will help us fix the authentication issues
// We need to replace all instances of secretManager.getCurrentSecret() with SecretManager.getCurrentSecret()

const fs = require('fs');
const path = require('path');

// Path to auth.ts file
const authFilePath = path.join(__dirname, 'server', 'routes', 'auth.ts');

// Read the file content
fs.readFile(authFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Replace all instances of the problematic pattern
  const fixedContent = data.replace(
    /const secretManager = SecretManager\.getInstance\(\);\s*const currentSecret = secretManager\.getCurrentSecret\(\);/g,
    'const currentSecret = SecretManager.getCurrentSecret();'
  );

  // Write the fixed content back to the file
  fs.writeFile(authFilePath, fixedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to the file:', err);
      return;
    }
    console.log('Successfully fixed authentication issues in auth.ts');
  });
});