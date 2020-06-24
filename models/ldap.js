const ldap = require('ldapjs');
const config = require('../config.js');

const client = ldap.createClient({
  url: config.ldap.url
});

const urs =config.ldap.urs;
const dn = config.ldap.dn;
const dnPss = config.ldap.dnPss;

const passwordToken = config.ldap.passwordToken;

const LDAP = {};


LDAP.validateUser = function (payload, callback) {

  var user = payload.user.trim().toLowerCase();

  var ldapusu  ='cn=' + user + ',' + config.ldap.ouUsuarios; //usuario a ingresar
  var password = payload.password;

  // valido que exista el password y que no sea un string vacio
  if(!password) {
    callback({
      success: false,
      message: "usuario o contraseña incorrecto."
    });
    return;
  }
  client.bind(ldapusu, password, function(err) {
    if(err == null) {
      client.bind(dn, dnPss, function(err) {
        if(err ==null){
          var opts = {
            filter: '(&(objectclass=user)(cn='+user+'))',
            scope: 'sub',
            attributes: ["cn", "surname", "givenname", "title", "mail"],
          };
          client.search(config.ldap.ouUsuarios, opts, function(err, response) {
            response.on('searchEntry', function(entry) {
              let ldapUser = entry.object;
              // Armo un objeto usuario con los datos que devuelve LDAP.
              let usuario = {};
              usuario.usuario = ldapUser.cn.toLowerCase();
              usuario.dni = ldapUser.title;
              usuario.nombre = ldapUser.givenname.toLowerCase();
              usuario.apellido = ldapUser.surname.toLowerCase();
              usuario.email = ldapUser.mail ? ldapUser.mail[0].toLowerCase() : '';

              callback({ success: true, usuario});
              return;
            });

            response.on('searchReference', function(referral) {
              callback(referral.uris.join());
              return;
            });

            response.on('error', function(err) {
              console.error(err.message);
              callback({
                success: false,
                message: "usuario o contraseña incorrecto."
              });
              return;
            });

          });

        }else{
          console.log(err.message);
          callback({
            success: false,
            message: "usuario o contraseña incorrecto."
          });
          return;
        }
      });

    } else {
      console.log(err.message);
      callback({
        success: false,
        message: "usuario o contraseña incorrecto."
      });
      return;
    }
  });
}


LDAP.getUsuarios = function (callback) {
  let usuarios = [];

  client.bind(dn, dnPss, function(err) {
    if(err ==null){
      var opts = {
        filter: '(&(objectclass=user))',
        scope: 'sub',
        attributes: ["cn","surname", "givenname", "title","mail"]
      };

      client.search(config.ldap.ouUsuarios, opts, function(err, response) {

        response.on('searchEntry', function(entry) {
          let ldapUser = entry.object;
          // Filtro los usuarios que tengan DNI, si no tienen, no son personas reales.
          if (ldapUser.title && ldapUser.title !== 'NO CORRESPONDE') {
            // Armo un objeto usuario con los datos que devuelve LDAP.
            let usuario = {};
            usuario.usuario = ldapUser.cn.toLowerCase();
            usuario.dni = ldapUser.title;
            usuario.nombre = ldapUser.givenname ? ldapUser.givenname.toLowerCase() : '';
            usuario.apellido = ldapUser.surname ? ldapUser.surname.toLowerCase() : '';
            usuario.email = ldapUser.mail ? ldapUser.mail[0].toLowerCase() : '';

            usuarios.push(usuario);
          }

        });

        response.on('end', function(result) {
          // ordeno alfabeticamente la lista de usuarios antes de devolverla
          ordenarPorNombreUsuario(usuarios);
          callback({ success: true, usuarios});
        });

        response.on('searchReference', function(referral) {
          callback(referral.uris.join());
          return;
        });

        response.on('error', function(err) {
          console.error('error: ' + err.message);
          callback({
            success: false,
            message: "No se han encontrado usuarios."
          });
          return;
        });

      });

    }else{
      console.error('error: ' + err.message);
      callback({
        success: false,
        message: "No se han encontrado usuarios."
      });
      return;
    }

  });
}


const ordenarPorNombreUsuario = function(usuarios) {
  usuarios.sort((a, b) => {
    if (a.usuario > b.usuario) {
      return 1;
    }

    if (a.usuario < b.usuario) {
      return -1;
    }

    return 0;
  })
}

module.exports = LDAP;
