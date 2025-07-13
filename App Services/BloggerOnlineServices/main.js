const express = require('express');
const axios = require('axios');
const router = express.Router();
const { logger } = require('../../src/utils/winston');
const log = logger();

log.info("Blogger Online Services loaded.");

router.get('/debug', (req, res) => {
    res.json({ ServiceName: 'Blogger Online Services', description: 'A microservice that fetches user IPs for Blogger.', ServiceVersion: 'v2-prod', Status: 'OK', Endpoints: [
        { method: 'GET', path: '/ip', description: 'Fetches the IP address and request details.' },
        { method: 'GET', path: '/debug', description: 'Returns debug information about the service.' }
    ] });
});

router.get('/ip', (req, res) => {
  const realIp = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.ip;
  res.json({ ip: realIp });
});

module.exports = router;