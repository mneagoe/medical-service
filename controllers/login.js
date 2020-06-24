const model = require('../models/login');
const login = {};


login.login = function(req, res, next) {
  model.login(req.body, function(obj) {
    res.json(obj);
  })
}



module.exports = login;
