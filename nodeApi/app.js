var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var cors=require('cors');
var routes = require('./routes/index');
var users = require('./routes/users');
var Books=require('./routes/Books');
var Reviews=require('./routes/Reviews');
var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false }));

app.use(cookieParser());

app.use('/', routes);
app.use('/users', users);
app.use('/Books',Books);
app.use('/Reviews',Reviews);
// catch 404 and forward to error handler
app.use(function(req, res, next) {

});

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
