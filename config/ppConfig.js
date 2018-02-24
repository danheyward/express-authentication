var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models');

// Passport 'serializes' objects to make them easy to store,
// Converting the user to an identifier.
passport.serializeUser(function(user, cb) { // passport.serializeModel(function(user, cb){})
  cb(null, user.id);
});

// Passport 'deserializes' objects by taking the user's serialization id
// and looking it up in the database
passport.deserializeUser(function(id, cb) { // passport.serializeModel(function(id, cb){})
  db.user.findById(id).then(function(user) {
    cb(null, user);
  }).catch(cb);
});

// Set up the local auth strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(email, password, cb) {
  db.user.find({
    where: { email: email }
  }).then(function(user) {
    if (!user || !user.validPassword(password)) {
      cb(null, false);
    } else {
      cb(null, user);
    }
  }).catch(cb);
}));

module.exports = passport;
