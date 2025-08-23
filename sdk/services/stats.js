module.exports = (client) => ({

  async getGlobal() {
    const res = await client.get('/stats/global');
    return res.data;
  },

  async getPool(poolAddress) {
    const res = await client.get(`/stats/pools/${poolAddress}`);
    return res.data;
  }
});
