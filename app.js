const appConfig = require('./config/app-config');

var createError = require('http-errors');
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

// const corsOptions = {
//   origin: '*', // Allow this specific origin
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true, // Allow credentials such as cookies
//   optionsSuccessStatus: 204
// };

// app.use(cors(corsOptions)); //TODO REMOVE. ONLY FOR DEV


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']) // trust reverse proxies from the following subnets

app.use(helmet()); //TODO add more security rules
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var indexRouter = require('./routes/index');
app.use('/', indexRouter);
var metricsRouter = require('./routes/metrics');  
app.use('/metrics', metricsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
