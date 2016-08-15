var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/users');
var bcrypt = require('bcrypt-nodejs');

router.get('/', function (req, res, next) {
    res.render('login', {
        title: 'Login'
    });
});

router.get('/login', function (req, res, next) {
    var email = req.param('email');
    var password = req.param('password');
    console.log(email)
    User.findOne({
        email: email
    }, function (err, user) {
        // console.info(bcrypt.compareSync(password, user.password));
        // console.log(user);
        if (err) {
            return res.json({
                success: false,
                err: err
            });
        }
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.json({
                success: false
            });
        }
        // delete user.password;
        user.password = null;
        return res.json({
            data: user,
            success: true
        });
    });

    // res.json(req.param('test'));
});
router.get('/register', function(req, res, next){
    res.render('register');
})
router.post('/register', function (req, res, next) {

    // var email = req.param('email');
    // var password = req.param('password');
    //
    var userData = new User({
        email: req.param('email'),
        // password: req.param('password'),

        // !!!!!!!!!!TODO Fix the password encryption !!!!!!
        password: bcrypt.hashSync(req.param('password')),
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        name: req.param('name'),
        picture: req.param('picture'),
        phone: req.param('phone'),
        dateOfBrith: req.param('dateOfBrith'),
        gender: req.param('gender'),
        interests: req.param('interests')
    });


    // var newUser = new User({
    //     email: email,
    //     password: bcrypt.hashSync(password)
    //     // firstName: userData.firstName,
    //     // lastName: userData.lastName,
    //     // phone: userData.phone,
    //     // town: userData.phone,
    //     // country: userData.country,
    //     // dateOfBirth: userData.dateOfBirth
    // });
    User.find({email: req.param('email')}, function (err, user) {
        if (user.length) {
            return res.send('user already exists !');
        } else {
            userData.save(function (err) {
                return res.send('User saved');
            });
        }
    })
});

router.post('/changepassword', function (req, res, next) {
    var data = req.query;
    User.findOne({email: data.email}, function (err, user) {
        var comparePasswords = bcrypt.compareSync(data.password, user.password);

        if (comparePasswords) {
            user.password = bcrypt.hashSync(data.newpassword);
            user.save(function (err) {
                if (err) {
                    return res.send(err)
                }
                return res.send('Password changed !');
            })
        } else {
            return res.send('Passwords do not match !')
        }

    });
});

router.post('/resetpassword', function (req, res, next) {
    var data = req.query;

    User.findOne({email: data.email}, function (err, user) {
        //TODO user exists

        //TODO send email to the user with a link for the password reset page

        //TODO validate the password

        //TODO reset the password

        //TODO Redirect or auto login
    });
});

// router.get('/login', function(req, res, next) {
//   res.send({
//     id:req.user._id,
//     user: req.user.email
//   });
// });
// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/login',
//     failureRedirect: '/login'
// }));
//
// router.get('/logout', function(req, res) {
//     req.logout();
//     res.redirect('/');
// });
module.exports = router;
