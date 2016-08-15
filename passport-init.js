var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('./models/users');
var bcrypt = require('bcrypt-nodejs');


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, done) {
    User.findOne({
        email: email
    }, function(err, user) {
        if (err) {
            return err;
        }
        if (!user || !bcrypt.compareSync(password, user.password)) {
            done(null, false);
            return;
        }
        done(null, user);
        return;
    });

}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
