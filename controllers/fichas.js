const model = require('../models/fichas');
const fichas = {};


fichas.getFichaCovid19 = function(req, res, next) {
  const usuario = req.body;
  model.getFichaCovid19(usuario, function(obj) {
    res.json(obj);
  })
}

fichas.getAllFichasCovid19 = function(req, res, next) {
  model.getAllFichasCovid19(function(obj) {
    res.json(obj);
  })
}

fichas.altaCovid19 = function(req, res, next) {
  const ficha = req.body;
  model.altaCovid19(ficha, function(obj) {
    res.json(obj);
  })
}



module.exports = fichas;
