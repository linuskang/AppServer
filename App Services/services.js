/*===================================
  Created by: Linus Kang
  Last updated: 8/04/2025
===================================*/

// App Service Routes
const AppServices = [
    {
        name: "Example Service",
        location: "ExampleService/main.js",
        path: "example"
    }
];

// END OF CONFIGURATION // DO NOT EDIT BELOW THIS LINE //

const path = require('path');
const { logger } = require('../App/Utils/winston');
const log = logger();

const loadServices = (app) => {
    AppServices.forEach((service) => {
        const servicePath = path.join(__dirname, service.location);
        try {
            const serviceModule = require(servicePath);
            const routePath = `/${service.path}`;
            log.info(`Loading service: ${service.name} at ${routePath}`);
            app.use(routePath, serviceModule);
        } catch (error) {
            log.error(`Failed to load ${service.name} from ${servicePath}: ${error.message}`);
        }
    });
};

module.exports = loadServices;