module.exports = (client) => ({

  async getAll() {
    const res = await client.get('/pools');
    return res.data;
  },

  async getSwaps(poolAddress, { limit = 100, offset = 0 } = {}) {
    const res = await client.get(`/pools/${poolAddress}/swaps`, {
      params: { limit, offset }
    });
    return res.data;
  },
  
  async getTimeSeries(poolAddress, { interval = 'hour', limit = 24 } = {}) {
    const res = await client.get(`/pools/${poolAddress}/timeseries/swaps`, {
      params: { interval, limit }
    });
    return res.data;
  }
});
