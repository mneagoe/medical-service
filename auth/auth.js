const jwt = require('jsonwebtoken');
const config = require('../config.js')
const auth = {};

auth.createToken = function(payload) {
  const passwordToken = config.ldap.passwordToken;
  return jwt.sign(payload, passwordToken, { expiresIn: '1h' });
}


auth.verifyToken = function(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;

    jwt.verify(req.token, config.ldap.passwordToken, (err, authData) => {
      if(err) {
        res.sendStatus(403);

      } else {
        // Next middleware
        next();
      }

    })

  } else {
    res.sendStatus(403);
  }
};

module.exports = auth;
