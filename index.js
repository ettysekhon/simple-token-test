'use strict';

/* eslint no-console:0 */
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const api = require('./api.routes');
const middleware = require('./server.middleware.js');
const app = express();
const port = process.env.PORT || 8082;

const isDomainWhiteLited = (origin, host) => {
  const whiteListDomains = ['localhost:3001', 'http://localhost:8082'];
  return whiteListDomains.indexOf(origin) || whiteListDomains.indexOf(host) !== -1
      ? origin || host
      : null;
};

const allowCrossDomain = (req, res, next) => {
  const domain = isDomainWhiteLited(req.headers.origin, req.headers.host);
  if (domain) {
    res.header('Access-Control-Allow-Origin', domain);
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'POST,PUT,GET,OPTIONS');
    next();
  } else {
    res.sendStatus(401);
  }
};

app.use(allowCrossDomain);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(middleware.applySessionCookie);

app.use('/store/api', api);

app.use(middleware.logErrors);
app.use(middleware.clientErrorHandler);
app.use(middleware.errorHandler);

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`==> 🌎 Open up http://localhost:${port}/ in your browser.`);
  }
});
