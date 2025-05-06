const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const env = process.env;
const { logger } = require('./utils/winston');
const log = logger();
const staticRoutes = require('./routes/static');
const apiRoutes = require('./routes/api');

app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(express.json());
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    log.info(`[client] Incoming: ${ip} - ${req.method} ${req.url}`);
    next();
});
app.use(staticRoutes);
app.use('/v1', apiRoutes);

// Apps
const rblx = require('./apps/rblx-webhooks.js');
const serviceRoutes = require('./apps/services.js');
app.use('/services', serviceRoutes);
app.use('/rblx', rblx);

app.use((err, req, res, next) => {
    const ip =req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
    log.error(`[server] Error from ${ip}: ${err.message}`);
    res.status(500).send('Internal Server Error. Please try again later.');
});

app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(env.port, '0.0.0.0', () => {
    log.info(`💻 Linus's API Server: Starting...`);
    log.info(`🚀 API server ready! Access at 0.0.0.0:${env.port}`);
});