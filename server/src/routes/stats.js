const express = require('express');
const router = express.Router();
const subgraphService = require('../services/subgraphService');

// GET /stats/global - Get global statistics
router.get('/global', async (req, res) => {
  try {
    const stats = await subgraphService.getGlobalStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching global stats:', error);
    res.status(500).json({ error: 'Failed to fetch global stats' });
  }
});

// GET /stats/pools/:poolAddress - Get statistics for a specific pool
router.get('/pools/:poolAddress', async (req, res) => {
  try {
    const { poolAddress } = req.params;
    const stats = await subgraphService.getPoolStats(poolAddress);
    
    if (!stats) {
      return res.status(404).json({ error: 'Pool not found' });
    }
    
    res.json({
      poolAddress,
      ...stats
    });
  } catch (error) {
    console.error('Error fetching pool stats:', error);
    res.status(500).json({ error: 'Failed to fetch pool stats' });
  }
});

module.exports = router;
