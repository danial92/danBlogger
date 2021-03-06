const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
          User.findOne({ email: email }, (err, user) => {
            if (err) throw err 
            if (!user) {
              return done(null, false, { message: 'Incorrect email.' });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                    return done(null, user);
                } else {
                  return done(null, false, { message: 'Incorrect password.' })
                }
            })
          });
        }
      ));
      passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}
