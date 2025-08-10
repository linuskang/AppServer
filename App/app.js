const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const env = process.env;
const { logger } = require('./Utils/winston');
const log = logger();
const staticRoutes = require('./Api/pages');
const apiRoutes = require('./Api/api');
const services = require('../App Services/services');
const cors = require('cors');

app.use(express.static(path.join(__dirname, 'App', 'Pub')));
app.use(express.json());
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    log.info(`${ip} - ${req.method} ${req.url}`);
    next();
});
app.use(staticRoutes);
app.use(cors());
app.use('/v1', apiRoutes);
services(app);
app.use((err, req, res, next) => {
    const ip =req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;
    log.error(`Error from ${ip}: ${err.message}`);
    res.status(500).send('Internal Server Error. Please try again later.');
});
app.use((res) => {
    res.status(404).send('404 Not Found');
});

app.listen(env.PORT, '0.0.0.0', () => {
    log.info(`🚀 AppServer running! Access at 0.0.0.0:${env.PORT}`);
    log.info(`🌐 Server URL: ${env.SERVER_URL}`)
});