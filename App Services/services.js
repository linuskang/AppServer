const path = require('path');
const { logger } = require('../src/utils/winston');
const log = logger();

const AppServices = [
    {
        name: "DayScope",
        location: "DayScope/main.js",
        path: "dayscope"
    },
    {
        name: "LinusOnlineServices",
        location: "LinusOnlineServices/main.js",
        path: "lkang"
    },
    {
        name: "Roblox",
        location: "Roblox/main.js",
        path: "roblox"
    },
    {
        name: "SystemController",
        location: "SystemController/main.js",
        path: "services"
    },
    {
        name: "BloggerOnlineServices",
        location: "BloggerOnlineServices/main.js",
        path: "bos"
    },
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