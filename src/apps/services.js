const express = require('express');
const { exec } = require('child_process');
const router = express.Router();
const { logger } = require('../utils/winston');
const log = logger();

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

function runSystemctlCommand(action, service, res, req, apikey) {
    if (!service || /[^a-zA-Z0-9@._-]/.test(service)) {
        log.warn(`Rejected ${action} request — invalid service name: ${service}`);
        return res.status(400).json({ error: 'Invalid service name' });
    }

    if (!apikey || apikey !== process.env.SERVICE_API_KEY) {
        log.warn(`Rejected ${action} request — invalid API key: ${apikey}`);
        return res.status(403).json({ error: 'Invalid API key' });
    }

    const cmd = `sudo systemctl ${action} ${service}`;
    log.info(`Received ${action} request from ${req.ip} for service: ${service}`);

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            log.error(`Failed to ${action} ${service}: ${stderr.trim()}`);
            return res.status(500).json({ error: stderr.trim() });
        }

        log.info(`Successfully ${action}ed ${service}`);
        log.debug(`Output: ${stdout.trim()}`);
        res.status(200).json({ success: true, output: stdout.trim() });
    });
}

router.get('/restart', (req, res) => {
    const service = req.query.service;
    const apikey = req.query.apikey;
    runSystemctlCommand('restart', service, res, req, apikey);
});

router.get('/start', (req, res) => {
    const service = req.query.service;
    const apikey = req.query.apikey;
    runSystemctlCommand('start', service, res, req, apikey);
});

router.get('/stop', (req, res) => {
    const service = req.query.service;
    const apikey = req.query.apikey;
    runSystemctlCommand('stop', service, res, req, apikey);
});

module.exports = router;
