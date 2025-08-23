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
    
    // Test 2: Get API info
    console.log('\n[TEST] API info');
    const info = await sdk.info();
    console.log('PASS: API info retrieved successfully');
    console.log('API Version:', info.version);
    console.log('Available Endpoints:', Object.keys(info.endpoints).length);
    
    // Test 3: Get all pools
    console.log('\n[TEST] Pools.getAll()');
    const pools = await sdk.pools().getAll();
    console.log('PASS: Retrieved', pools.length, 'pools');
    
   
    
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
