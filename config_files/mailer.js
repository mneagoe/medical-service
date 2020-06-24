const mailer = {};
mailer.entorno = {};

mailer.config = {
  from: '',
  host: '',
  secureConnection: false,
  port: 443,
  transportMethod: 'SMTP',
};

mailer.local = {
  novedades: {
    from: '',
    to: '',
    subject: '(local) Medical Service: News Report',
    otherProperty: 'Other Property',
  }
}

mailer.desarrollo = {
  novedades: {
    from: '',
    to: '',
    cc: '',
    subject: '(desa) Medical Service: News Report',
    otherProperty: 'Other Property',
  },
};


mailer.produccion = {
  novedades: {
    from: '',
    to: '',
    cc: '',
    bcc: '',
    subject: 'Medical Service: News Report',
    otherProperty: 'Other Property',
  },
};


module.exports = mailer;
