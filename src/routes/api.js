const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const env = process.env;

router.get('/', (req, res) => {
    res.json({ name: env.name, version: env.version, port: env.port, status: 'OK' });
});

module.exports = router;