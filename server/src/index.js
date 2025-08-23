require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const swapsRoutes = require('./routes/swaps');
const poolsRoutes = require('./routes/pools');
const statsRoutes = require('./routes/stats');
const timeseriesRoutes = require('./routes/timeseries');
const healthRoutes = require('./routes/health');
const SwapWebSocketServer = require('./services/wsServer');
const SwapDataService = require('./services/swapDataService');
const DatabaseService = require('./services/databaseService');

const databaseService = new DatabaseService();
const swapDataService = new SwapDataService(databaseService);
const wsServer = new SwapWebSocketServer(swapDataService, databaseService);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/swaps', swapsRoutes);
app.use('/pools', poolsRoutes);
app.use('/stats', statsRoutes);
app.use('/timeseries', timeseriesRoutes);
app.use('/health', healthRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Lixer API Server',
    version: '1.0.0',
    endpoints: {
      swaps: '/swaps',
      pools: '/pools',
      stats: '/stats',
      timeseries: '/timeseries',
      health: '/health',
      factories: '/factories',
      tokens: '/tokens',
      websocket: `ws://localhost:${WS_PORT}`
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

wsServer.start(WS_PORT).then(() => {
  console.log(`WebSocket server started on port ${WS_PORT}`);
}).catch(error => {
  console.error('Failed to start WebSocket server:', error);
});

server.listen(PORT, () => {
  console.log(`Lixer API Server running on port ${PORT}`);
  console.log(`WebSocket server running on port ${WS_PORT}`);
  console.log(`Subgraph URL: ${process.env.SUBGRAPH_URL}`);
});

process.on('SIGINT', async () => {
  console.log('\nShutting down servers...');
  await wsServer.stop();
  server.close();
  process.exit(0);
});

module.exports = app;
