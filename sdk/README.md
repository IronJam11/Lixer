# @lixersdk/sdk

Official Lixer SDK for accessing real-time and historical DeFi swap data across all major DEXs.

## Installation

```bash
npm install @lixersdk/sdk
```

## Quick Start

```javascript
const LixerSDK = require('@lixersdk/sdk');

// Initialize SDK (no configuration needed)
const lixer = new LixerSDK();

// Get recent swaps
const swaps = await lixer.swaps().getAll({ limit: 10 });
console.log(swaps);

// Get all pools
const pools = await lixer.pools().getAll();
console.log(pools);

// Connect to real-time WebSocket
const ws = await lixer.websocket().connect();
ws.on('message', (data) => {
  const swapEvent = JSON.parse(data);
  console.log('New swap:', swapEvent);
});
```

## TypeScript Support

```typescript
import LixerSDK, { SwapEvent, Pool } from '@lixersdk/sdk';

const lixer = new LixerSDK();

const swaps: SwapEvent[] = await lixer.swaps().getAll({ limit: 100 });
const pools: Pool[] = await lixer.pools().getAll();
```

## API Reference

### Swaps

```javascript
// Get all swaps with optional filtering
const swaps = await lixer.swaps().getAll({
  limit: 100,     // Optional: number of results (default: 100)
  offset: 0,      // Optional: pagination offset (default: 0)
  pool: '0x...'   // Optional: filter by pool address
});

// Get specific swap by ID
const swap = await lixer.swaps().getById('swap-id');
```

### Pools

```javascript
// Get all pools
const pools = await lixer.pools().getAll();

// Get swaps for a specific pool
const poolSwaps = await lixer.pools().getSwaps('0x...', {
  limit: 50,
  offset: 0
});

// Get time-series data for a pool
const timeSeries = await lixer.pools().getTimeSeries('0x...', {
  interval: 'hour',  // 'hour', 'day', 'week'
  limit: 24
});
```

### Statistics

```javascript
// Get global statistics
const globalStats = await lixer.stats().getGlobal();

// Get pool-specific statistics
const poolStats = await lixer.stats().getPool('0x...');
```

### Time Series

```javascript
// Get time-series swap data
const timeSeries = await lixer.timeseries().getSwaps({
  interval: 'hour',
  limit: 24
});
```

### Health Check

```javascript
// Check API health
const health = await lixer.health().check();
```

### WebSocket (Real-time Data)

```javascript
// Get WebSocket connection info
const wsInfo = await lixer.websocket().getUrl();

// Connect to WebSocket for real-time data
const ws = await lixer.websocket().connect();

ws.on('open', () => {
  console.log('Connected to Lixer WebSocket');
});

ws.on('message', (data) => {
  const swapEvent = JSON.parse(data);
  console.log('Real-time swap:', swapEvent);
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});
```

## Configuration

The SDK works out of the box with no configuration required. It automatically connects to Lixer's hosted infrastructure.

If you need to use a custom endpoint (for development or enterprise deployments):

```javascript
const lixer = new LixerSDK('https://your-custom-endpoint.com');
```

Or set the environment variable:

```bash
export LIXER_API_URL=https://your-custom-endpoint.com
```

## Data Types

### SwapEvent
```typescript
interface SwapEvent {
  id: string;
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  logIndex: number;
  poolAddress: string;
  timestamp: number;
  timestampISO: string;
  sender: string;
  recipient: string;
  amount0: string;
  amount1: string;
  sqrtPriceX96: string;
  liquidity: string;
  tick: string;
}
```

### Pool
```typescript
interface Pool {
  id: string;
  factory: string;
  token0: string;
  token1: string;
  fee: string;
  tickSpacing: string;
  liquidity: string;
  sqrtPrice: string;
  tick: string;
  volumeToken0: string;
  volumeToken1: string;
  swapCount: string;
  createdAtTimestamp: string;
  createdAtBlockNumber: string;
}
```

## Error Handling

The SDK includes automatic retry logic and error handling. All methods return Promises and can be used with async/await or .catch():

```javascript
try {
  const swaps = await lixer.swaps().getAll();
  console.log(swaps);
} catch (error) {
  console.error('Error fetching swaps:', error.message);
}
```

## Requirements

- Node.js 14 or higher
- Internet connection for API access

## Support

- GitHub Issues: [https://github.com/Haxry/lixer/issues](https://github.com/Haxry/lixer/issues)


## License

MIT
