const axios = require('axios');

class SubgraphService {
  constructor() {
    this.subgraphUrl = process.env.SUBGRAPH_URL;
    if (!this.subgraphUrl) {
      throw new Error('SUBGRAPH_URL environment variable is required');
    }
  }

  async query(query, variables = {}) {
    try {
      const response = await axios.post(this.subgraphUrl, {
        query,
        variables
      });

      if (response.data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
      }

      return response.data.data;
    } catch (error) {
      console.error('Subgraph query error:', error.message);
      throw error;
    }
  }

  // Get swaps with pagination and optional pool filter
  async getSwaps(limit = 100, offset = 0, poolAddress = null) {
    const poolFilter = poolAddress ? `, where: { pool: "${poolAddress.toLowerCase()}" }` : '';
    
    const query = `
      query GetSwaps($first: Int!, $skip: Int!) {
        swaps(
          first: $first, 
          skip: $skip, 
          orderBy: timestamp, 
          orderDirection: desc
          ${poolFilter}
        ) {
          id
          transaction
          timestamp
          blockNumber
          pool {
            id
          }
          sender
          recipient
          amount0
          amount1
          sqrtPriceX96
          liquidity
          tick
          gasUsed
          gasPrice
        }
      }
    `;

    const data = await this.query(query, { first: limit, skip: offset });
    return data.swaps.map(this.formatSwap);
  }

  // Get single swap by ID
  async getSwapById(id) {
    const query = `
      query GetSwap($id: ID!) {
        swap(id: $id) {
          id
          transaction
          timestamp
          blockNumber
          pool {
            id
          }
          sender
          recipient
          amount0
          amount1
          sqrtPriceX96
          liquidity
          tick
          gasUsed
          gasPrice
        }
      }
    `;

    const data = await this.query(query, { id });
    return data.swap ? this.formatSwap(data.swap) : null;
  }

  // Get pools
  async getPools() {
    const query = `
      query GetPools {
        pools(orderBy: swapCount, orderDirection: desc) {
          id
          swapCount
          totalVolumeAmount0
          totalVolumeAmount1
        }
      }
    `;

    const data = await this.query(query);
    return data.pools;
  }

  // Get global stats
  async getGlobalStats() {
    const query = `
      query GetGlobalStats {
        pools {
          id
          swapCount
          totalVolumeAmount0
          totalVolumeAmount1
        }
        swaps(
          first: 1000,
          where: { timestamp_gte: "${Math.floor(Date.now() / 1000) - 86400}" }
        ) {
          id
          amount0
          amount1
          timestamp
          sender
        }
      }
    `;

    const data = await this.query(query);
    
    const totalSwaps = data.pools.reduce((sum, pool) => sum + parseInt(pool.swapCount), 0);
    const activePools = data.pools.filter(pool => parseInt(pool.swapCount) > 0).length;
    
    const volume24h = data.swaps.reduce((sum, swap) => {
      return sum + Math.abs(parseFloat(swap.amount0)) + Math.abs(parseFloat(swap.amount1));
    }, 0);

    return {
      totalSwaps,
      volume24h: volume24h.toString(),
      activePools
    };
  }

  // Get pool-specific stats
  async getPoolStats(poolAddress) {
    const timestamp24hAgo = Math.floor(Date.now() / 1000) - 86400;
    
    const query = `
      query GetPoolStats($poolId: ID!, $timestamp24hAgo: BigInt!) {
        pool(id: $poolId) {
          id
          swapCount
          totalVolumeAmount0
          totalVolumeAmount1
        }
        swaps(
          first: 1000,
          where: { 
            pool: $poolId,
            timestamp_gte: $timestamp24hAgo
          }
        ) {
          id
          amount0
          amount1
          sender
        }
      }
    `;

    const data = await this.query(query, { 
      poolId: poolAddress.toLowerCase(), 
      timestamp24hAgo: timestamp24hAgo.toString()
    });

    if (!data.pool) {
      return null;
    }

    const swaps24h = data.swaps;
    const volume24h = swaps24h.reduce((sum, swap) => {
      return sum + Math.abs(parseFloat(swap.amount0)) + Math.abs(parseFloat(swap.amount1));
    }, 0);

    const uniqueTraders24h = new Set(swaps24h.map(swap => swap.sender)).size;
    const averageSwapSize = swaps24h.length > 0 ? volume24h / swaps24h.length : 0;

    return {
      swapCount24h: swaps24h.length,
      volume24h: volume24h.toString(),
      averageSwapSize: averageSwapSize.toString(),
      uniqueTraders24h
    };
  }

  // Get volume time series
  async getVolumeTimeSeries(interval = 'hour', limit = 24, poolAddress = null) {
    const now = Math.floor(Date.now() / 1000);
    const intervalSeconds = interval === 'hour' ? 3600 : 86400;
    const startTime = now - (limit * intervalSeconds);

    const poolFilter = poolAddress ? `, pool: "${poolAddress.toLowerCase()}"` : '';
    
    const query = `
      query GetVolumeTimeSeries($startTime: BigInt!) {
        swaps(
          first: 1000,
          where: { timestamp_gte: $startTime ${poolFilter} }
          orderBy: timestamp
          orderDirection: asc
        ) {
          timestamp
          amount0
          amount1
        }
      }
    `;

    const data = await this.query(query, { startTime: startTime.toString() });
    
    // Group swaps by time buckets
    const buckets = {};
    
    data.swaps.forEach(swap => {
      const bucketTime = Math.floor(parseInt(swap.timestamp) / intervalSeconds) * intervalSeconds;
      if (!buckets[bucketTime]) {
        buckets[bucketTime] = 0;
      }
      buckets[bucketTime] += Math.abs(parseFloat(swap.amount0)) + Math.abs(parseFloat(swap.amount1));
    });

    return Object.entries(buckets)
      .map(([time, volume]) => ({
        time: parseInt(time),
        volume: volume.toString()
      }))
      .sort((a, b) => a.time - b.time)
      .slice(-limit);
  }

  formatSwap(swap) {
    return {
      id: swap.id,
      txHash: swap.transaction,
      poolAddress: swap.pool.id,
      sender: swap.sender,
      recipient: swap.recipient,
      amount0: swap.amount0,
      amount1: swap.amount1,
      sqrtPriceX96: swap.sqrtPriceX96,
      liquidity: swap.liquidity,
      tick: parseInt(swap.tick),
      timestamp: parseInt(swap.timestamp),
      blockNumber: parseInt(swap.blockNumber),
      gasUsed: swap.gasUsed,
      gasPrice: swap.gasPrice
    };
  }
}

module.exports = new SubgraphService();
