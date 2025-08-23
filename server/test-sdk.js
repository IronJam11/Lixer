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
    
    // Test 4: Get stats
    console.log('\n[TEST] Stats.getGlobal()');
    const stats = await sdk.stats().getGlobal();
    console.log('PASS: Global stats retrieved successfully');
    console.log('Total Swaps:', stats.totalSwaps);
    console.log('Active Pools:', stats.activePools);
    
    // Test 5: Get all swaps
    console.log('\n[TEST] Swaps.getAll()');
    const swapsResponse = await sdk.swaps().getAll({ limit: 5 });
    console.log('PASS: Retrieved', swapsResponse.data ? swapsResponse.data.length : 0, 'swaps');
    
    // Test 6: If pools exist, test pool-specific methods
    if (pools && pools.length > 0) {
      const firstPool = pools[0];
      const poolId = firstPool.id || firstPool.address;
      
      console.log('\n[TEST] Pool-specific methods for pool:', poolId);
      
      // Test pool swaps
      const poolSwapsResponse = await sdk.pools().getSwaps(poolId, { limit: 5 });
      console.log('PASS: Pool.getSwaps() retrieved', 
        poolSwapsResponse.data ? poolSwapsResponse.data.length : 0, 'swaps');
      
      // Test pool timeseries
      const timeseriesResponse = await sdk.pools().getTimeSeries(poolId, { limit: 5 });
      console.log('PASS: Pool.getTimeSeries() retrieved', 
        timeseriesResponse.data ? timeseriesResponse.data.length : 0, 'entries');
    }
    
    console.log('\n------------------------------');
    console.log('All SDK tests completed successfully');
    console.log('------------------------------');
    
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
