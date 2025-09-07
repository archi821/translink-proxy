require('dotenv').config(); // 讀取 .env 檔案

const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.TRANSLINK_API_KEY;
console.log('API Key:', API_KEY); // 可選：確認是否成功讀取

app.get('/', (req, res) => {
  res.send('TransLink Proxy Server is running 🚍');
});

app.get('/api/route/:id', async (req, res) => {
  const routeId = req.params.id;
  try {
    const response = await fetch(
      `https://api.translink.ca/rttiapi/v1/routes/${routeId}?apikey=${API_KEY}`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'translink-proxy-server',
        },
      }
    );

    const contentType = response.headers.get('content-type');
    if (!response.ok || !contentType?.includes('application/json')) {
      const html = await response.text();
      return res.status(500).json({
        error: 'API 錯誤',
        details: 'TransLink 回傳非 JSON',
        htmlPreview: html.slice(0, 200),
      });
    }

    const data = await response.json();
    res.json(Array.isArray(data) ? data : [data]);
  } catch (err) {
    res.status(500).json({ error: 'API 錯誤', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
