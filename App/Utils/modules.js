/*===================================
  Created by: Linus Kang
  Last updated: 19/09/2025
===================================*/

// Modules
const express = require('express');
const axios = require('axios');
const { logger } = require('../../App/Utils/winston');
const { auth } = require('../../App/Api/auth');

const router = express.Router();
const log = logger();

module.exports = {
  express,
  axios,
  router,
  logger,
  log,
  auth,
};