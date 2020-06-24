const app = require('express')();
var path = require('path');
const mailer = require('express-mailer');
const config = require('../config');
const email = config.mailer;

mailer.extend(app, email.config);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

const emails = {};

emails.sendReporteNovedadesFichasCovid = function(reporte, callback) {
  const mailerOptions = email.options.novedades;
  // Agrego el objeto reporte a las opciones del email:
  mailerOptions.reporte = reporte;
  
  app.mailer.send('emailFichaCovid19', mailerOptions, function (err) {
    if (err) {
      // handle error
      callback(`Error al enviar el reporte de novedades: ${err}`);
      return;
    }
    callback(`Enviado: Reporte de novedades, ${new Date()}`);
  });
}

module.exports = emails;