const express = require('express');
const axios = require('axios');
const router = express.Router();
const { logger } = require('../../App/Utils/winston');
const log = logger();

const NetDB = require('./NetDBManager/netdb');
const db = NetDB("http://localhost:3100", "linuskangrylangabrielcharlesyuarjavrabarifllteamapp-3-08-2025");

log.info("Bleulegs Internal APIs loaded.");

router.get('/', (req, res) => {
    res.json({
        ServiceName: 'Bleulegs Internal APIs',
        description: 'A microservice that provides internal APIs for Team Bleulegs.',
        ServiceVersion: 'v1-prod',
        Status: 'OK',
    });
});

router.post('/sql', async (req, res) => {
  try {
    const { query, params } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Missing query in request body' });
    }

    let parsedParams = [];
    if (params) {
      if (!Array.isArray(params)) {
        return res.status(400).json({ error: 'Params must be an array' });
      }
      parsedParams = params;
    }

    const result = await db.rawSQL(query, parsedParams);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;