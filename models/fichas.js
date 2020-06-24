const config = require('../config');
const moment = require('moment');
const db = config.db.medical;
const fichas = {};

fichas.getFichaCovid19 = function(usuario, callback) {
  db.one(`mySelectQuery`, usuario)
    .then(data => {
      callback({
        success: true,
        message: 'Ficha encontrada.',
        ficha: data,
      })
      return;
    })
    .catch(error => {
      console.log(error.message);
      callback({
        success: false,
        message: 'Error, no se ha podido obtener la ficha.'
      })
      return;
    })
}

fichas.getAllFichasCovid19 = function(callback) {
  db.any(`mySelectQuery`)
    .then(data => {
      callback({
        success: true,
        message: 'Fichas encontrados.',
        fichas: data,
      })
      return;
    })
    .catch(error => {
      console.log(error.message);
      callback({
        success: false,
        message: 'Error al traer las fichas.'
      })
      return;
    })
}


fichas.getAllShadowFichasCovid19 = function(callback) {
  db.any(`mySelectQuery`)
    .then(data => {
      callback({
        success: true,
        message: 'Fichas encontrados.',
        fichas: data,
      })
      return;
    })
    .catch(error => {
      console.log(error.message);
      callback({
        success: false,
        message: 'Error al traer las fichas.'
      })
      return;
    })
}


fichas.altaCovid19 = function(ficha, callback) {
  // Si no tengo el atributo fechaDeRetorno, lo agrego y le pongo valor nulo
  if ( typeof ficha.fechaDeRetorno === 'undefined') {
    ficha.fechaDeRetorno = null;
  }
  // esta es la fecha de creacion del registro
  ficha.fecha = moment().format();

  db.none(`myInsertQuery`, ficha)
    .then(() => {
      callback({
        success: true,
        message: 'La ficha ha sido dada de alta.',
      })
      return;
    })
    .catch(error => {
      console.log(error.message);
      callback({
        success: false,
        message: `Error, no se ha podido dar de alta la ficha.`,
      })
      return;
    });

}


// Carga toda la tabla shadow_ficha_covid19 de agn_salud con las ficha_covid19
fichas.cargarTablaShadowFichasCovid19 = function(fichas) {
  db.tx(async t => {
    await t.none('myQuery');

    fichas.map(async ficha => {
      await t.none(`myInsertQuery`, ficha);
    }); // map
  })
  .then(data => {
    console.log('all good!');
  })
  .catch(error => {
    console.error(`fichas.cargarTablaShadowFichasCovid19: ${error.message}`);
  });
  
}

module.exports = fichas;
