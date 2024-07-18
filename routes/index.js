const appConfig = require('../config/app-config');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(200);
});

router.get('/client-file', function(req, res, next) {
  res.setHeader('Content-Type','text/javascript; charset=UTF-8');
  res.render('jcmc-client-file', { jcmc_push_url: appConfig.ALLOW_PRIVATE_SCRAPE_ONLY });
});


module.exports = router;
