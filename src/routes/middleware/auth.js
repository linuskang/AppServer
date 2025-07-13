const dotenv = require('dotenv');
const { logger } = require('../../utils/winston');
const log = logger();
dotenv.config();
const env = process.env;
const apiToken = env.API_KEY;

const auth = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const token = req.headers['authorization'];
    const route = `${req.method} ${req.originalUrl}`;

    log.info(`[AUTH REQUEST] IP: ${ip} | Route: ${route}`);

    if (!token) {
        log.warn(`[AUTH FAILED] IP: ${ip} | Route: ${route}: No Token Provided`);
        return res.status(403).json({ message: 'Access Denied.' });
    }

    if (token !== `Bearer ${apiToken}`) {
        log.error(`[AUTH FAILED] IP: ${ip} | Route: ${route} | Invalid API Token`);
        return res.status(401).json({ message: 'Access Denied' });
    }

    log.info(`[AUTH SUCCESS] IP: ${ip} | Route: ${route}`);
    next();
};

module.exports = {
    auth
};