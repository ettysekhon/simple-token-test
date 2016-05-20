'use strict';

exports.token = (req, res, next) => {
  // don't do anything here - just for testing
  // middleware does it
  res.json({
    payload: req.session
  });
};
