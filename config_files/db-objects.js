var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);

const db = {};

// desarrollo
db.medical_desa = pgp('connection string');
// produccion:
db.medical_prod = pgp('connection string');

module.exports = db;
