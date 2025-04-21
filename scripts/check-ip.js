// Simple script to check current IP address for MongoDB Atlas whitelist
const https = require('https');

// Function to get current public IP
function getCurrentIP() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org', (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Main function
async function checkIP() {
  try {
    const ip = await getCurrentIP();
    
    console.log('\n==== MongoDB Atlas IP Whitelist Guide ====');
    console.log(`Current public IP address: ${ip}`);
    console.log('\nTo connect to MongoDB Atlas:');
    console.log('1. Log in to your MongoDB Atlas dashboard');
    console.log('2. Go to Network Access in the Security section');
    console.log('3. Click "Add IP Address"');
    console.log(`4. Add this IP: ${ip}`);
    console.log('5. Or for development, use "Allow Access from Anywhere" (0.0.0.0/0)');
    console.log('\nAlternative solution:');
    console.log('1. Create a new MongoDB Atlas cluster with "M0 Free" tier');
    console.log('2. When creating the cluster, choose "Allow access from anywhere"');
    console.log('3. Update your MONGODB_URI environment variable with the new connection string');
    console.log('\n====================================\n');
  } catch (error) {
    console.error('Failed to get current IP:', error);
  }
}

// Run the check
checkIP();