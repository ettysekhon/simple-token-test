'use strict';

const express = require('express');
const apiController = require('./api.controller');
const router = express.Router(); // eslint-disable-line
const middleware = require('./server.middleware.js');

router.route('/token').post(middleware.initUser, apiController.token);

module.exports = router;
