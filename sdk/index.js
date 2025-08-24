const axios = require('axios');

class LixerSDK {
  constructor(baseURL) {
    const defaultURL = 'https://lixer.onrender.com/';
    
    this.client = axios.create({
      baseURL: baseURL || process.env.LIXER_API_URL || defaultURL,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async info() {
    const res = await this.client.get('/');
    return res.data;
  }

  swaps() {
    return require('./services/swaps')(this.client);
  }

  pools() {
    return require('./services/pools')(this.client);
  }

  stats() {
    return require('./services/stats')(this.client);
  }

  timeseries() {
    return require('./services/timeseries')(this.client);
  }

  health() {
    return require('./services/health')(this.client);
  }

  websocket() {
    return require('./services/websocket')(this.client);
  }
}

module.exports = LixerSDK;
