const express = require('express');
const router = express.Router();
const subgraphService = require('../services/subgraphService');

// GET /timeseries/volume - Get volume time series across all pools
router.get('/volume', async (req, res) => {
  try {
    const interval = req.query.interval || 'hour';
    const limit = parseInt(req.query.limit) || 24;

    if (!['hour', 'day'].includes(interval)) {
      return res.status(400).json({ error: 'Interval must be "hour" or "day"' });
    }

    if (limit > 168) {
      return res.status(400).json({ error: 'Limit cannot exceed 168' });
    }

    const timeseries = await subgraphService.getVolumeTimeSeries(interval, limit);
    
    const now = Math.floor(Date.now() / 1000);
    const debugInfo = {
      currentTimestamp: now,
      currentTime: new Date(now * 1000).toISOString(),
      dataTimestamps: timeseries.map(item => ({
        timestamp: item.time,
        humanReadable: new Date(item.time * 1000).toISOString(),
        isFuture: item.time > now
      }))
    };
    
    res.json({
      interval,
      data: timeseries,
      debug: req.query.debug === 'true' ? debugInfo : undefined
    });
  } catch (error) {
    console.error('Error fetching volume timeseries:', error);
    res.status(500).json({ error: 'Failed to fetch volume timeseries' });
  }
});

module.exports = router;
