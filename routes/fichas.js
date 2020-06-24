var express = require('express');
var router = express.Router();
const auth = require('../auth/auth');
const db = require('../controllers/fichas');

router.post('/altaCovid19', auth.verifyToken, db.altaCovid19);
router.get('/getCovid19', auth.verifyToken, db.getAllFichasCovid19);
router.post('/getCovid19', auth.verifyToken, db.getFichaCovid19);

module.exports = router;
