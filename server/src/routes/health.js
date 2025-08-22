const express = require('express');
const router = express.Router();

// GET /health - Health check endpoint
router.get('/', async (req, res) => {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      subgraphUrl: process.env.SUBGRAPH_URL,
      version: '1.0.0'
    };

    try {
      const subgraphService = require('../services/subgraphService');
      await subgraphService.query('{ pools(first: 1) { id } }');
      healthData.subgraphStatus = 'connected';
    } catch (error) {
      healthData.subgraphStatus = 'disconnected';
      healthData.subgraphError = error.message;
    }

    res.json(healthData);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;
