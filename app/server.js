var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var router = require('./routes');

var uri = process.env.MONGODB_URI || 'mongodb://localhost/timetable';

mongoose.connect(uri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();
var port = process.env.PORT || 3000;

// express middleware setup
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/', router);

app.listen(port, function () {
  console.log('TimeTable app listening on port ' + port + '!');
});

module.exports = {
  app: app,
  db: db
};
