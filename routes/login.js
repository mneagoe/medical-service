var express = require('express');
var router = express.Router();
var db = require('../controllers/login');

router.post('/', db.login);

module.exports = router;
