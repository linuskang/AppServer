/*===================================
  Created by: Linus Kang
  Last updated: 5/10/2025
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

// Server routes
const staticRoutes = require('./Api/pages');
const apiRoutes = require('./Api/api');

// Micro services
const services = require('../App Services/services');

app.use(express.static(path.join(__dirname, 'App', 'Pub')));
app.use(express.json());
app.use(cors());

// Request logging
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    log.info(`[Request] ${req.method} ${req.originalUrl} from IP: ${ip}`);
    log.info(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
    next();
}
);

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        log.info(`[${res.statusCode}] ${req.method} ${req.originalUrl} - ${duration}ms`);
    });
    next();
});

// Server routes
app.use(staticRoutes);
app.use('/api', apiRoutes);

// /health
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() })
})

// Services
services(app);

// Code 500
app.use((err, req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
    log.error(`Error from ${ip}: ${err.stack}`);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// 404 Page
app.use((req, res) => {
    res.status(404).json('404 Not Found');
});

// Process error logging
process.on('uncaughtException', (err) => {
    log.error(`Uncaught Exception: ${err.stack}`);
});

process.on('unhandledRejection', (reason) => {
    log.error(`Unhandled Rejection: ${reason}`);
});

app.listen(env.PORT, '0.0.0.0', () => {
    log.info(`🚀 AppServer v2.4.0 running on port ${env.PORT}`);
    log.info(`🌐 Base URL: ${env.API_URL}`);
    log.info(`🧩 Environment: ${env.NODE_ENV}`);
    log.info(`📦 Services Loaded: ${Object.keys(services).length}`);
});