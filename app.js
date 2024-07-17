const appConfig = require('./config/app-config');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');



const helmet = require("helmet");


var app = express();

// // REDIS 
// app.use(function(req, res, next) {
//   req.redisClient = redisClient;
//   next();
// });

app.use(helmet()); //TODO add more security rules
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index');
app.use('/', indexRouter);
var metricsRouter = require('./routes/metrics');  
app.use('/metrics', metricsRouter);

module.exports = app;
