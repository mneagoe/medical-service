var express = require('express');
var router = express.Router();
const config = require('../config.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Medical Service', entorno: config.entorno });
});

module.exports = router;
