var router = require('express').Router();
var https = require('https');
var User = require('./models/User.js');
var twClient = require('./twilio_config.js');

// create a new user
router.post('/users', authorize, function(req, res) {

  User.findOne({ email: req.email }, function(err, user) {

    if (err) {
      res.status(500).send(err);
    } else if (user){
      res.status(400).send('A user with this email already exists.');
    } else {
      User.create({ email: req.email, phone: req.body.phone, rate: req.body.rate }, function(err, created) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(201).send(created);
        }
      });
    }

  });

});

// edit user details
router.patch('/users', authorize, function(req, res) {

  User.findOne({ email: req.email }, function(err, user) {

    if (err) {
      res.status(500).send(err);
    } else if (user){
      user.update(req.body, function(err, anything) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send('User updated.');
        }
      })
    } else {
      res.status(404).send('User not found.');
    }

  });

});

// get authenticated user
router.get('/users', authorize, function(req, res) {

  User.findOne({ email: req.email }, function(err, user) {

    if (err) {
      res.status(500).send(err);
    } else if (user){
      res.status(200).send(user);
    } else {
      res.status(404).send('User not found.');
    }

  });

});

// delete authenticated user
router.delete('/users', authorize, function(req, res) {

  User.findOneAndRemove({ email: req.email }, function(err, user) {

    if (err) {
      res.status(500).send(err);
    } else if (user){
      res.status(200).send('User ' + user.email + ' deleted.');
    } else {
      res.status(404).send('User not found.');
    }

  });

});

// create new client for authenticated user
router.post('/clients', authorize, function(req, res) {

  User.findOne({ email: req.email }, function(err, user) {

    if (err) {
      res.status(500).send(err);
    } else if (user){
      user.clients.push(req.body);

      user.save(function (err) {
        if (err) {
          res.status(500).send(err);
        } else {
          var subdoc = user.clients[user.clients.length - 1];
          res.status(200).send(subdoc);
        }
      });

    } else {
      res.status(404).send('User not found.');
    }

  });

});

// get all clients for authorized user
router.get('/clients', authorize, function(req, res) {

  User.findOne({ email: req.email }, function(err, user) {

    if (err) {
      res.status(500).send(err);
    } else if (user){
      res.status(200).send(user.clients);
    } else {
      res.status(404).send('User not found.');
    }

  });

});

// retrieve a specific client
router.get('/clients/:id', authorize, function(req, res) {

  User.findOne({ email: req.email }, function(err, user) {

    if (err) {
      res.status(500).send(err);
    } else if (user){
        var client = user.clients.id(req.params.id);
        if (client) {
          res.status(200).send(client);
        } else {
          res.status(404).send('Client id not found.');
        }
    } else {
      res.status(404).send('User not found.');
    }

  });

});

// edit a specific client
router.patch('/clients/:id', authorize, function(req, res) {

  User.findOne({ email: req.email }, function(err, user) {

    if (err) {
      res.status(500).send(err);
    } else if (user){
        var client = user.clients.id(req.params.id);
        if (client) {
          var keys = Object.keys(req.body);
          keys.forEach(function(key) {
            if (client[key] != null) {
              client[key] = req.body[key];
            }
          });
          user.save();
          res.status(200).send(user.clients.id(req.params.id));
        } else {
          res.status(404).send('Client id not found.');
        }
    } else {
      res.status(404).send('User not found.');
    }

  });

});

// delete a specific client
router.delete('/clients/:id', authorize, function(req, res) {

  User.findOne({ email: req.email }, function(err, user) {

    if (err) {
      res.status(500).send(err);
    } else if (user){
      var deleted = user.clients.id(req.params.id);
      if (deleted) {
        deleted.remove();
        user.save();
        res.status(200).send(deleted);
      } else {
        res.status(404).send('Client id not found.');
      }
    } else {
      res.status(404).send('User not found.');
    }

  });

});

// send an sms reminder to a client about their balance
router.put('/clients/:id/alert', authorize, function(req, res) {

  User.findOne({ email: req.email }, function(err, user) {

    if (err) {
      res.status(500).send(err);
    } else if (user){
        var client = user.clients.id(req.params.id);
        if (client) {
          var msg = 'Hi there, this is a payment reminder for the $' + client.balance + ' you have outstanding. Email ' + user.email + ' to pay. Thanks!';
          twClient.messages.create({
              body: msg,
              to: client.phone,
              from: '+18318882253'
          }).then(function(err, message) {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).send('Payment reminder sent to client ' + user.fullname);
            }
          });
        } else {
          res.status(404).send('Client id not found.');
        }
    } else {
      res.status(404).send('User not found.');
    }

  });

});

// this middleware authorizes requests using Google
function authorize(req, res, next) {

  var options = {
    hostname: 'www.googleapis.com',
    path: '/plus/v1/people/me',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + req.headers['x-access-token']
    }
  };

  var request = https.request(options, function(response) {
    response.setEncoding('utf8');
    var message = "";
    response.on('data', function (chunk) {
      message += chunk;
    });
    response.on('end', function () {
        message = JSON.parse(message);
        if (message.error) {
          res.status(message.error.code).send(message.error.message);
        } else {
          var email = message.emails[0].value;
          req.email = email;
          next();
        }
    });
  });

  request.end();

};

module.exports = router;
