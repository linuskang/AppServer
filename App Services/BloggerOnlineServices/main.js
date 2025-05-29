const express = require('express');
const axios = require('axios');
const router = express.Router();
const { logger } = require('../../src/utils/winston');
const log = logger();

log.info("Blogger Online Services loaded.");

router.get('/v', (req, res) => {
    res.json({ name: 'Blogger', current_version: 'v1.0.6' });
});

module.exports = router;