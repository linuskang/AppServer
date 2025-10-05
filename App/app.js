/*===================================
  Created by: Linus Kang
  Last updated: 19/09/2025
===================================*/

// Packages
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
const env = process.env;

// Logger
const { logger } = require('./Utils/winston');
const log = logger();

// Routes
const staticRoutes = require('./Api/pages');
const apiRoutes = require('./Api/api');

// Micro services
const services = require('../App Services/services');

// Middleware and routes
app.use(express.static(path.join(__dirname, 'App', 'Pub')));
app.use(express.json());
app.use((req, res, next) =>
    {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        log.info(`[Request] ${req.method} ${req.originalUrl} from IP: ${ip}`);
        log.info(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
        next();
    }
);
app.use(staticRoutes);
app.use(cors());
app.use('/v1', apiRoutes);
services(app);
app.use((err, req, res, next) => {
    const ip =req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
    log.error(`Error from ${ip}: ${err.message}`);
    res.status(500).send('Internal Server Error. Please try again later.');
});
app.use((req, res) => {
    res.status(404).json('404 Not Found');
});

app.listen(env.PORT, '0.0.0.0', () => {
    log.info(`🚀 AppServer running! Access at 0.0.0.0:${env.PORT}`);
    log.info(`🌐 Server URL: ${env.API_URL}`)
});