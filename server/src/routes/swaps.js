const express = require('express');
const router = express.Router();
const subgraphService = require('../services/subgraphService');

// GET /swaps - Get all swaps with pagination and optional pool filter
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const pool = req.query.pool;

    if (limit > 1000) {
      return res.status(400).json({ error: 'Limit cannot exceed 1000' });
    }

    const swaps = await subgraphService.getSwaps(limit, offset, pool);
    
    res.json({
      data: swaps,
      pagination: {
        limit,
        offset,
        count: swaps.length
      },
      filter: pool ? { pool } : null
    });
  } catch (error) {
    console.error('Error fetching swaps:', error);
    res.status(500).json({ error: 'Failed to fetch swaps' });
  }
});

// GET /swaps/:id - Get single swap by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const swap = await subgraphService.getSwapById(id);
    
    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }
    
    res.json(swap);
  } catch (error) {
    console.error('Error fetching swap:', error);
    res.status(500).json({ error: 'Failed to fetch swap' });
  }
});

module.exports = router;
