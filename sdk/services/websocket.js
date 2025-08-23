module.exports = (client) => ({

  async getUrl() {
    const res = await client.get('/websocket/url');
    return res.data;
  },

  async connect(wsURL) {
    const WebSocket = require('ws');
    const url = wsURL || (await this.getUrl()).url;
    return new WebSocket(url);
  }
});
