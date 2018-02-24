var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();

router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

router.post('/signup', function(req, res) {
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(function(user, created) {
    if (created) {
      // User was created
      console.log('User created');
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in.'
      })(req, res);
    } else {
      // Email already exists in db
      console.log('email already exists');
      req.flash('error', 'Email already exists.');
      res.redirect('/auth/signup');
    }
  }).catch(function(error) {
    console.log('An error occurred: ', error.message);
    req.flash('error', error.message);
    res.redirect('/auth/signup');
  });
});

router.get('/login', function(req, res) {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  successFlash: 'You have logged in!',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid unsername and / or password.'
}));

router.get('/logout', function(req, res) {
  req.logout();
  console.log('User is logged out');
  req.flash('success', 'You have logged out.');
  res.redirect('/');
});

module.exports = router;
