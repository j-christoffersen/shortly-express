const models = require('../models');
const Promise = require('bluebird');

module.exports.sessions = (req, res, next) => {
  return new Promise((resolve, reject) => {
    if (req.cookies['shortlyid']) {
      resolve(models.Sessions.get({hash: req.cookies['shortlyid']}));
    } else {
      resolve();
    }
  })
  .then(session => {
    if (!session) {
      return module.exports.newSession(req, res);
    } else {
      return session;
    }
  })
  .then(session => {
    req.session = session;
    next();
  });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.redirectIfNotLoggedIn = function(req, res, next) {
  if (!req.session || !req.session.userId) {
    res.redirect('/login');
  } else {
    next();
  }
};

// Helper functions
/**
 * @returns {Promise<Object>} A promise that is fulfilled with a session object
 */
module.exports.newSession = function(req, res, options) {
  return models.Sessions.create(options)
  .then(success => {
    return models.Sessions.get({id: success.insertId});
  })
  .then(session => {
    res.cookie('shortlyid', session.hash);
    return session;
  });
};