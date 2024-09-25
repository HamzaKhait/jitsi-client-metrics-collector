const appConfig = require('../config/app-config');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("JCMC IS UP"); 
});

router.get('/client-file', function(req, res, next) {
  res.setHeader('Content-Type','text/javascript; charset=UTF-8');
  res.render('jcmc-client-file', { jcmc_push_url: appConfig.PUSH_URL });
});


module.exports = router;
