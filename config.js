const db = require('./config_files/db-objects');
const ldap = require('./config_files/ldap');
const mailer = require('./config_files/mailer');

const entornos = {};

entornos.local = {
  ldap,
  puerto: 3031,
  entorno: 'local',
  protocolo: 'http',
  mailer: {
    config: mailer.config,
    options: mailer.local,
  },
  db: {
    medical: db.medical_desa,
  },
};

entornos.desarrollo = {
  ldap,
  puerto: 3031,
  entorno: 'desarrollo',
  protocolo: 'https',
  mailer: {
    config: mailer.config,
    options: mailer.desarrollo,
  },
  db: {
    medical: db.medical_desa,
  },
};

entornos.produccion = {
  ldap,
  puerto: 3031,
  entorno: 'produccion',
  protocolo: 'https',
  mailer: {
    config: mailer.config,
    options: mailer.produccion,
  },
  db: {
    medical: db.medical_prod,
  },
};


// Determine which environment was passed as a command-line argument
let entornoActual = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the curren environment is one of the environments above, if not, default to staging
let entornoAExportar = typeof(entornos[entornoActual]) === 'object' ? entornos[entornoActual] : entornos.local;
// let entornoAExportar = entornos[process.env.NODE_ENV];

// Export the module
module.exports = entornoAExportar;
