require('./db');
require('./auth');

var passport = require('passport');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

var mongoose = require('mongoose');

//routes
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//authentication setup
var session = require('express-session');
var sessionOptions = {
	secret: 'abc',
	resave: true,
	saveUninitialized: true
};
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
	res.locals.user = req.user;    //middleware that adds req.user context to every template
	next();
});
//===============================

//proxy for site that doesn't have CORS headers
app.use('/proxy', function(req, res) {  
  var searchTerm = req.url.replace('/', '');
  var url = 'http://jisho.org/api/v1/search/words?keyword=' + searchTerm;
  req.pipe(request(url)).pipe(res);
});
//===============================


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
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
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
