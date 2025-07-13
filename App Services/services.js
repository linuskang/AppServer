const path = require('path');
const { logger } = require('../src/utils/winston');
const log = logger();

const AppServices = [
    {
        name: "LinusOnlineServices",
        location: "LinusOnlineServices/main.js",
        path: "lkang"
    },
    {
        name: "BloggerOnlineServices",
        location: "BloggerOnlineServices/main.js",
        path: "bos"
    }
];

const loadServices = (app) => {
    AppServices.forEach((service) => {
        const servicePath = path.join(__dirname, service.location);
        try {
            const serviceModule = require(servicePath);
            const routePath = `/${service.path}`;
            log.info(`Loading service: ${service.name} at ${routePath}`);
            app.use(routePath, serviceModule);
        } catch (error) {
            log.error(`Failed to load ${service.name} from ${servicePath}:`, error.message);
        }
    });
};

module.exports = loadServices;