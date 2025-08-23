module.exports = (client) => ({

  async getAll({ limit = 100, offset = 0, pool = null } = {}) {
    const res = await client.get('/swaps', {
      params: { limit, offset, pool }
    });
    return res.data;
  },

  async getById(id) {
    const res = await client.get(`/swaps/${id}`);
    return res.data;
  }
});
