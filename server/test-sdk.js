/**
 * Lixer SDK Test Suite
 * 
 * This script tests the functionality of the Lixer SDK by calling
 * various endpoints and validating the responses.
 */

const LixerSDK = require('./src/sdk/index.js');

/**
 * Main test function
 */
async function testSDK() {
  // Initialize SDK with API base URL
  const sdk = new LixerSDK('http://localhost:3000');
  
  console.log('LIXER SDK TEST SUITE\n');
  
  try {
    // Test 1: Health check
    console.log('[TEST] Health check');
    const healthCheck = await sdk.health().check();
    console.log('PASS: Health endpoint responded with status:', healthCheck.status);
    
    
  } catch (error) {
    console.error('TEST FAILED:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the test
testSDK();
