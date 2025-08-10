const dotenv = require('dotenv');
const { logger } = require('../Utils/winston');
const log = logger();
dotenv.config();
const env = process.env;
const apiToken = env.API_TOKEN;

const auth = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const token = req.headers['authorization'];
    const route = `${req.method} ${req.originalUrl}`;

    if (!token) {
        log.warn(`${ip} - ${route}: No Token Provided`);
        return res.status(403).json({ message: 'Access Denied.' });
    }

    if (token !== `Bearer ${apiToken}`) {
        log.error(`${ip} - ${route}: Invalid API Token`);
        return res.status(401).json({ message: 'Access Denied' });
    }

    log.info(`[auth] success on ${ip} - ${route}`);
    next();
};

module.exports = { auth };