require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swapsRoutes = require('./routes/swaps');
const poolsRoutes = require('./routes/pools');
const statsRoutes = require('./routes/stats');
const timeseriesRoutes = require('./routes/timeseries');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

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
      tokens: '/tokens'
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

app.listen(PORT, () => {
  console.log(`Lixer API Server running on port ${PORT}`);
  console.log(`Subgraph URL: ${process.env.SUBGRAPH_URL}`);
});

module.exports = app;
