module.exports = (client) => ({
  async check() {
    try {
      const res = await client.get('/health');
      return res.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }
});