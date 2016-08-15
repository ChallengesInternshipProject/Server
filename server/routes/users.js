var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../models/users');
var bcrypt = require('bcrypt-nodejs');
//var $q = require('q');

//FOR TESTING PURPOSES !!!
// User.remove({},function(err){
//   console.log('all removed');
// });
// var testUser = new User({
//     email: 'test@intern.com',
//     password: bcrypt.hashSync('test'),
// });
// //
// testUser.save();
// /* GET users listing. */
// var hash = bcrypt.hashSync("wtf");
// console.log(hash);

//END OF TESTING PURPOSES
router.get('/', function (req, res, next) {
	User.find(function (err, users) {
		res.json(users)
	});
});

router.get('/:user', function (req, res, next) {

    // return res.send(req.params)
    User.findOne({email: req.params.user}, function (err, user) {
        if (err) {
            return res.send(err);
        }
        if(!user){
            return res.send('User not found !');
        }

        //remove the pass hash from the response
        user.password = null;

        return res.json(user);
    });
});
//TODO HIDE USER PASSWORDS
router.get('/friends/:user/:status', function(req, res, next){
	var Status = require("mongoose-friends").Status;
	
	searchParams = {
		"friends.status": Status[req.params.status],
	};
	for(var key in req.query){
		searchParams[key]= new RegExp("^.*"+req.query[key]+".*$",'i');
	}

	User.getFriends(req.params.user,  searchParams, function(err,friends){
		return res.json(friends);
	})

})
module.exports = router;