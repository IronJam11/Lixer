# Lixer

**Lixer** is a comprehensive SDK and analytics platform that provides real-time and historical swap data across all major DEXs supported by LiquidLabs. Built on top of Goldsky's infrastructure, Lixer delivers decoded swap events with sub-second latency, making it the ideal solution for analytics dashboards, MEV bots, yield optimizers, and DeFi applications.

## Table of Contents

- [Architecture Overview](#architecture-overview)
  - [Data Indexing Layer](#data-indexing-layer)
  - [Core Components](#core-components)
- [Use Cases](#use-cases)
- [Supported Protocols](#supported-protocols)
- [Technical Specifications](#technical-specifications)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Quick Start Example](#quick-start-example)
  - [TypeScript Support](#typescript-support)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)
- [Roadmap](#roadmap)

## Architecture Overview
Lixer is built as a multi-component system designed for scalability and real-time data processing:

![Lixer Architecture](monorepo/public/images/Screenshot%20from%202025-08-24%2023-26-05.png)

### Data Indexing Layer
- **Historical Data**: Utilizes Goldsky subgraphs to index historical swap events from multiple DEX protocols
- **Real-time Data**: Leverages Goldsky mirror pipelines with direct log indexing for live swap data
- **Event Decoding**: Automatically decodes raw blockchain logs into structured swap event data

### Core Components

#### 1. [**SDK**](https://www.npmjs.com/package/@lixersdk/sdk) (`/sdk`)
A lightweight JavaScript/Node.js SDK available on npm that provides instant access to Lixer's data without any configuration:

```javascript
const LixerSDK = require('@lixersdk/sdk');
const lixer = new LixerSDK();

// Get swap data
const swaps = await lixer.swaps().getAll({ limit: 100 });

// Get pool information
const pools = await lixer.pools().getAll();

// Subscribe to real-time events
const ws = await lixer.websocket().connect();
```

**Features:**
- Zero configuration - works out of the box
- Simple HTTP client for REST API access
- WebSocket support for real-time data streaming
- Built-in error handling and retry logic
- TypeScript compatible
- Hosted infrastructure - no server setup required

#### 2. **API Server** (`/server`)
A robust Express.js backend deployed on onrender that serves as the data access layer:

**Key Services:**
- **Swap Data Service**: Manages swap event retrieval and processing
- **Database Service**: PostgreSQL integration with real-time notifications
- **WebSocket Server**: Handles real-time data streaming to clients
- **Swap Decoder**: Decodes raw blockchain logs using ethers.js

**API Endpoints:**
- `GET /swaps` - Retrieve swap events with filtering options
- `GET /pools` - Get pool information and statistics
- `GET /stats` - Access global and pool-specific statistics
- `GET /timeseries` - Time-series data for analytics
- `GET /health` - Service health monitoring
- `WebSocket /ws` - Real-time event streaming

**Infrastructure:**
- Deployed for high availability
- Managed PostgreSQL database
- Automated scaling and monitoring
- 99.99% uptime SLA

#### 3. **Subgraphs** (`/subgraphs`)
GraphQL-based data indexing for historical data:

- **HyperSwap Subgraph**: Indexes factory and pool events from HyperEVM
- **Schema Definition**: Comprehensive GraphQL schema for pools, swaps, and tokens
- **Event Handlers**: Custom mappings for processing blockchain events

#### 4. **Analytics Dashboard** (`/monorepo`)
A professional Next.js dashboard for data visualization and analysis:

**Features:**
- Real-time swap monitoring with WebSocket integration
- Interactive charts using ApexCharts
- Pool analytics and performance metrics
- Time-series data visualization
- Responsive design with modern UI components

**Key Components:**
- Overview cards displaying key metrics
- Interactive charts for swap volume and trends
- Real-time notifications for swap events
- Advanced filtering and search capabilities

#### 5. **Mirror Pipeline** 
Goldsky mirror pipeline configuration for real-time data ingestion:

- Direct log indexing from multiple pool addresses
- PostgreSQL sink for structured data storage
- Real-time trigger setup for instant notifications

## Use Cases

### Analytics Dashboards
- Real-time swap monitoring across multiple DEXs
- Historical trend analysis and volume tracking
- Pool performance metrics and comparisons
- Custom analytics with flexible API access

### MEV Bots
- Sub-second swap event notifications
- Direct access to decoded transaction data
- WebSocket streaming for minimal latency
- Comprehensive pool and token information

### Yield Optimizers
- Pool liquidity tracking and analysis
- Historical yield calculation data
- Real-time price impact monitoring
- Cross-DEX opportunity identification

### DeFi Applications
- Zero-config integration for rapid development
- Standardized data format across all supported DEXs
- Real-time and historical data access via single SDK
- Scalable hosted infrastructure - no server management required

## Supported Protocols

Lixer currently supports swap data from all major DEXs integrated with LiquidLabs, such as:
- Hyperswap V3 pools


## Technical Specifications

### Performance
- **Latency**: Sub-second real-time data delivery
- **Throughput**: Capable of processing millions of events
- **Uptime**: 99.99% availability with automatic failover
- **Scalability**: Horizontally scalable architecture

### Data Format
All swap events include standardized fields:
- Transaction details (hash, block number, timestamp)
- Pool information (address, tokens, fee tier)
- Swap details (amounts, price impact, sender/recipient)
- Gas metrics (used, price)
- Decoded and formatted for easy consumption

### Infrastructure
- **Database**: Managed PostgreSQL with real-time triggers
- **WebSocket**: Real-time event streaming
- **API**: RESTful endpoints hosted on onrender
- **Monitoring**: Built-in health checks and error tracking

## Getting Started

### Installation

Simply install the [Lixer SDK](https://www.npmjs.com/package/@lixersdk/sdk) from npm:

```bash
npm install @lixersdk/sdk
```

That's it! No configuration required - the SDK connects to our hosted infrastructure automatically.

### Quick Start Example

```javascript
const LixerSDK = require('@lixersdk/sdk');

// Initialize SDK (no configuration needed)
const lixer = new LixerSDK();

// Get recent swaps
const recentSwaps = await lixer.swaps().getAll({ limit: 10 });
console.log('Recent swaps:', recentSwaps);

// Connect to real-time stream
const ws = await lixer.websocket().connect();
ws.on('message', (data) => {
  const swapEvent = JSON.parse(data);
  console.log('New swap detected:', swapEvent);
});
```

### TypeScript Support

```typescript
import LixerSDK from '@lixersdk/sdk';

const lixer = new LixerSDK();

// Fully typed responses
const swaps: SwapEvent[] = await lixer.swaps().getAll({ limit: 100 });
const pools: Pool[] = await lixer.pools().getAll();
```

## API Documentation

### Swap Events
```javascript
// Get all swaps with optional filtering
GET /swaps?limit=100&offset=0&pool=0x...

// Get specific swap by ID
GET /swaps/:id
```

### Pool Data
```javascript
// Get all pools
GET /pools

// Get swaps for specific pool
GET /pools/:address/swaps

// Get time-series data for pool
GET /pools/:address/timeseries/swaps?interval=hour&limit=24
```

### Statistics
```javascript
// Global statistics
GET /stats/global

// Pool-specific statistics  
GET /stats/pools/:address
```

## Contributing

We welcome contributions to the Lixer SDK! 

### SDK Development

To contribute to the SDK:

1. Fork the repository
2. Clone your fork locally
3. Navigate to the SDK directory: `cd sdk`
4. Install dependencies: `npm install`
5. Make your changes
6. Test your changes: `npm test`
7. Submit a pull request

### Reporting Issues

- Create an issue on GitHub for bugs or feature requests
- Include detailed information about your use case
- Provide code examples when applicable

### Development Setup

For local development and testing:

```bash
git clone https://github.com/Haxry/lixer.git
cd lixer/sdk
npm install
npm run dev
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check our [npm package documentation](https://www.npmjs.com/package/@lixersdk/sdk)



## Roadmap

- [ ] Advanced analytics and alerting features
- [ ] Mobile SDK for React Native
- [ ] Enhanced WebSocket filtering capabilities
- [ ] Integration with popular DeFi protocols
- [ ] Python SDK
- [ ] REST API rate limiting and authentication
- [ ] Historical data export features

---

**Lixer** - Powering the next generation of DeFi applications with real-time, reliable swap data. Simply `npm install @lixersdk/sdk` and start building.
