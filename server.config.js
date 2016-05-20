'use strict';

module.exports = {
  SECRET: 'keepitsecret',
  AUTH_COOKIE_NAME: 'st',
  AUTH_TOKEN_EXPIRY: 3600, // 1 hour
  AUTH_COOKIE_MAX_AGE: '3600000', // 1 hour
  SESSION_COOKIE_NAME: 'stp',
  SESSION_COOKIE_MAX_AGE: '31536000000', // 365 days (in milliseconds)
};
