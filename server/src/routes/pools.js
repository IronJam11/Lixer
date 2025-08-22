const express = require('express');
const router = express.Router();
const subgraphService = require('../services/subgraphService');
const poolsData = require('../../pools.json');

// GET /pools - List all pools
router.get('/', async (req, res) => {
  try {
    const pools = await subgraphService.getPools();
    
    const enrichedPools = pools.map(pool => {
      const metadata = poolsData.pools.find(p => 
        p.address.toLowerCase() === pool.id.toLowerCase()
      );
      
      return {
        ...pool,
        address: pool.id,
        metadata: metadata || null
      };
    });
    
    res.json(enrichedPools);
  } catch (error) {
    console.error('Error fetching pools:', error);
    res.status(500).json({ error: 'Failed to fetch pools' });
  }
});

// GET /pools/:poolAddress/swaps - Get swaps for specific pool
router.get('/:poolAddress/swaps', async (req, res) => {
  try {
    const { poolAddress } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    if (limit > 1000) {
      return res.status(400).json({ error: 'Limit cannot exceed 1000' });
    }

    const swaps = await subgraphService.getSwaps(limit, offset, poolAddress);
    
    res.json({
      poolAddress,
      data: swaps,
      pagination: {
        limit,
        offset,
        count: swaps.length
      }
    });
  } catch (error) {
    console.error('Error fetching pool swaps:', error);
    res.status(500).json({ error: 'Failed to fetch pool swaps' });
  }
});

// GET /pools/:poolAddress/timeseries/swaps - Get swap time series for specific pool
router.get('/:poolAddress/timeseries/swaps', async (req, res) => {
  try {
    const { poolAddress } = req.params;
    const interval = req.query.interval || 'hour';
    const limit = parseInt(req.query.limit) || 24;

    if (!['hour', 'day'].includes(interval)) {
      return res.status(400).json({ error: 'Interval must be "hour" or "day"' });
    }

    if (limit > 168) { 
      return res.status(400).json({ error: 'Limit cannot exceed 168' });
    }

    const timeseries = await subgraphService.getVolumeTimeSeries(interval, limit, poolAddress);
    
    res.json({
      poolAddress,
      interval,
      data: timeseries
    });
  } catch (error) {
    console.error('Error fetching pool timeseries:', error);
    res.status(500).json({ error: 'Failed to fetch pool timeseries' });
  }
});

module.exports = router;
