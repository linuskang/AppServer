const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ AppServer: 'Linus Kang Software', Version: 'V2.4.0', Status: 'OK', Endpoints: [
        { method: 'GET', path: '/v1', description: 'Information about AppServer' },
        { method: 'GET', path: '/', description: 'Homepage' },
        { method: 'GET', path: '/src/styles', description: 'Styling for homepage' },
        { method: 'GET', path: '/health', description: 'Get server health statistics'}
    ] });
});

module.exports = router;