const config = require('../config');
const ldap = require('./ldap');
const auth = require('../auth/auth');

const login = {};

login.login = function(credenciales, callback) {

  ldap.validateUser(credenciales, function(obj) {
    if (!obj.success) {
      callback(obj);
      return;
    }

    const payload = obj.usuario;

    const token = auth.createToken(payload);
    callback({token});
    return;
  });

}

module.exports = login;
