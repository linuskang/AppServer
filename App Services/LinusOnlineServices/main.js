const express = require('express');
const axios = require('axios');
const router = express.Router();
const { logger } = require('../../src/utils/winston');
const { auth } = require('../../src/routes/middleware/sysauth');
const log = logger();

log.info("Linus Online Services loaded.");

router.get('/', (req, res) => {
    res.json({ service_name: 'Linus Online Services', status: '200 OK', version: '1.0.0' });
});

router.get('/authroute', auth, (req, res) => {
    res.json({ pass: 'true' });
});

// curl -X GET https://app.linuskang.au/lkang/authroute -H "Authorization: Bearer linuskang09032011.au"

module.exports = router;