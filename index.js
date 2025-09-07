const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.TRANSLINK_API_KEY;

app.get('/api/route/:id', async (req, res) => {
  const routeId = req.params.id;
  try {
    const response = await fetch(
      `https://api.translink.ca/rttiapi/v1/routes/${routeId}?apikey=${API_KEY}`,
      { headers: { Accept: 'application/json' } }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'API 錯誤', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
