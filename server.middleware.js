'use strict';

const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const config = require('./server.config');
const objectAssign = require('object-assign');

/* eslint-disable consistent-return */
exports.initUser = (req, res, next) => {
  const AUTH_COOKIE_NAME = config.AUTH_COOKIE_NAME;
  const httpOnlyAuthCookie = req.cookies[AUTH_COOKIE_NAME];
  // httpOnly auth cookie token is set on login/signup routes
  // and cleared on logout, on expiry user will need to login again
  if (httpOnlyAuthCookie) {
    jwt.verify(httpOnlyAuthCookie, config.SECRET, (err, decoded) => {
      if (err) {
        return next(new Error('invalid token provided'));
      }
      /* eslint-disable no-param-reassign */
      req.user = decoded;
      /* eslint-enable no-param-reassign */
      return next();
    });
  } else {
    return next();
  }
};

exports.applySessionCookie = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  var sessionCookie = req.cookies[config.SESSION_COOKIE_NAME];
  const bid = uuid.v4();
  const uid = uuid.v4();
  // if we don't have a session cookie then just generate a new one
  // note: username is updated on login/signup
  if (!sessionCookie) {
    sessionCookie = {
      bid,
      uid,
      username: ''
    };
  }

  res.cookie(config.SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: false,
    maxAge: config.SESSION_COOKIE_MAX_AGE
  });

  /* eslint-disable no-param-reassign */
  req.session = objectAssign({}, sessionCookie);
  /* eslint-enable no-param-reassign */
  next();
};
/* eslint-enable consistent-return */
exports.logErrors = (err, req, res, next) => {
  console.error(err.stack);
  next(err);
};

exports.clientErrorHandler = (err, req, res, next) => {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
};

exports.errorHandler = (err, req, res, next) => {
  res.status(500);
  res.render('error', { error: err });
};
