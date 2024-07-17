const appConfig = require('../config/app-config');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');


var indexRouter = require('./routes/index');
var metricsRouter = require('./routes/metrics');

var app = express();

// // REDIS 
// app.use(function(req, res, next) {
//   req.redisClient = redisClient;
//   next();
// });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    cors({origin: ['https://testmeet.meaplus.com']})
  );  

app.use('/', indexRouter);
app.use('/metrics', metricsRouter);

module.exports = app;
