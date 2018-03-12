var User = require('./user.js');

module.exports = function(app, passport) {

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup'), function (req, res) {
    res.status(201).send('Signup successful');
  });

  app.delete('/', isLoggedIn, function (req, res){
    var user = req.user;
    user.remove(function (err) {
      if (err) {
        return res.status(400).send('ERROR: User not deleted');
      }
    });
    req.logout();
    res.status(200).send('User deleted');
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login'), function (req, res) {
    res.status(201).json(req.user);
  });

  app.get('/logout', isLoggedIn, function (req, res){
    req.logout();
    res.status(200).send('User logged out');
  });

  app.put('/classes', isLoggedIn, function (req, res) {

    var user = req.user;
    user.classes.push(req.body);
    user.save(function(err) {
        if (err) {
          console.log(err);
          res.status(418).send('Error! Class not added.');
        } else {
          res.status(201).send('Class added to queue.');
        }
    });

  });

  app.get('/classes', isLoggedIn, function (req, res) {
    res.status(200).send(req.user.classes);
  });

  app.delete('/classes', isLoggedIn, function (req, res) {
    for (var i = 0; i < req.user.classes.length; i++) {
      if (req.user.classes[i].classID == req.query.delete) {
        req.user.classes[i].remove(function (err) {
          if (err) {
            res.status(400).send('ERROR: Class not deleted');
          }
        });
        req.user.save(function (err) {
          if (err) {
            return res.status(400).send('ERROR: Class not deleted');
          }
        });
        return res.status(200).send('Class deleted');
      }
    }
    return res.status(400).send('Class not found');
  });

  app.put('/bikes', isLoggedIn, function (req, res) {

    req.user.bikes[req.body.studio].addToSet(req.body.bikeNo);
    req.user.save(function (err) {
      if (err) {
        res.status(500).send('ERROR: Bike number not saved');
      } else {
        res.sendStatus(201);
      }
    });

  });

  app.post('/rez', function (req, res) {

    // if (req.user.local.email == 'pedro@pedrotp.com') {

      User.find({}, function (err, users) {
        if (err) {
          console.log(err);
          res.sendStatus(400);
        } else {
          users.forEach(function (u) {
            u.makeReservations();
          });
          res.sendStatus(200);
        }
      });

    // } else {
    //   res.sendStatus(401);
    // }

  });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.sendStatus(401);
};
var User = require('./user.js');

module.exports = function(app, passport) {

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup'), function (req, res) {
    res.status(201).send('Signup successful');
  });

  app.delete('/', isLoggedIn, function (req, res){
    var user = req.user;
    user.remove(function (err) {
      if (err) {
        return res.status(400).send('ERROR: User not deleted');
      }
    });
    req.logout();
    res.status(200).send('User deleted');
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login'), function (req, res) {
    res.status(201).json(req.user);
  });

  app.get('/logout', isLoggedIn, function (req, res){
    req.logout();
    res.status(200).send('User logged out');
  });

  app.put('/classes', isLoggedIn, function (req, res) {

    var user = req.user;
    user.classes.push(req.body);
    user.save(function(err) {
        if (err) {
          console.log(err);
          res.status(418).send('Error! Class not added.');
        } else {
          res.status(201).send('Class added to queue.');
        }
    });

  });

  app.get('/classes', isLoggedIn, function (req, res) {
    res.status(200).send(req.user.classes);
  });

  app.delete('/classes', isLoggedIn, function (req, res) {
    for (var i = 0; i < req.user.classes.length; i++) {
      if (req.user.classes[i].classID == req.query.delete) {
        req.user.classes[i].remove(function (err) {
          if (err) {
            res.status(400).send('ERROR: Class not deleted');
          }
        });
        req.user.save(function (err) {
          if (err) {
            return res.status(400).send('ERROR: Class not deleted');
          }
        });
        return res.status(200).send('Class deleted');
      }
    }
    return res.status(400).send('Class not found');
  });

  app.put('/bikes', isLoggedIn, function (req, res) {

    req.user.bikes[req.body.studio].addToSet(req.body.bikeNo);
    req.user.save(function (err) {
      if (err) {
        res.status(500).send('ERROR: Bike number not saved');
      } else {
        res.sendStatus(201);
      }
    });

  });

  app.post('/rez', function (req, res) {

    // if (req.user.local.email == 'pedro@pedrotp.com') {

      User.find({}, function (err, users) {
        if (err) {
          console.log(err);
          res.sendStatus(400);
        } else {
          users.forEach(function (u) {
            u.makeReservations();
          });
          res.sendStatus(200);
        }
      });

    // } else {
    //   res.sendStatus(401);
    // }

  });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.sendStatus(401);
};
