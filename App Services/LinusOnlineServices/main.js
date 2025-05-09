const express = require('express');
const axios = require('axios');
const router = express.Router();
const { logger } = require('../../src/utils/winston');
const log = logger();

log.info("Linus Online Services loaded.");

router.get('/', (req, res) => {
    res.json({ service_name: 'Linus Online Services', status: '200 OK', version: '1.0.0' });
});

module.exports = router;