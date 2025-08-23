const express = require('express');
const router = express.Router();

router.get('/url', (req, res) => {
  const wsPort = process.env.WS_PORT || 8080;
  const wsUrl = `ws://localhost:${wsPort}`;
  
  res.json({
    url: wsUrl,
    port: wsPort
  });
});

module.exports = router;
