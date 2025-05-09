const express = require('express');
const axios = require('axios');
const router = express.Router();
const { logger } = require('../../src/utils/winston');
const log = logger();

log.info("DayScope online services loaded.");

router.get('/', (req, res) => {
    res.json({ service_name: 'DayScope Online Services', status: 'OK' });
});

router.get('/send', (req, res) => {
    res.json({ service_name: 'DayScope Online Services', status: 'Sent!' });
});

module.exports = router;