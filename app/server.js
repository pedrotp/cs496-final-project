var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var session = require('express-session');
var passport = require('passport');

var uri = process.env.MONGODB_URI || 'mongodb://localhost/timetable';

mongoose.connect(uri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();
var port = process.env.PORT || 3000;

// express middleware setup
app.use(bodyParser.json());
app.use(cookieParser()); // read cookies (needed for auth)
app.use(morgan('dev'));

require('./passport')(passport); // pass passport for configuration

// passport authentication
app.use(session({ secret: 'chiggywiggywoodledoodle', saveUninitialized: true, resave: false })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./routes')(app, passport);

app.listen(port, function () {
  console.log('TimeTable app listening on port ' + port + '!');
});

module.exports = {
  app: app,
  db: db
};
