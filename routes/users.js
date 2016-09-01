var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../models/users');
var bcrypt = require('bcrypt-nodejs');
var Notification = require('../models/notifications')
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
router.get("/list/",function(req,res,next){
	var ObjectID = require('mongoose').Types.ObjectId;
	
	var queryParams = {};
	if(typeof req.query.friends == 'string') {
		req.query.friends = [req.query.friends]
	 }
	for(var i in req.query.friends) {
		if (!queryParams["_id"]) {
			queryParams["_id"] = {
				"$nin" : []
			}
		}
		queryParams["_id"]["$nin"].push(new ObjectID(req.query.friends[i]));
	}
	User.find(queryParams,function(err,users){
		if (err) { return next(err);};
		res.json(users);
	})
})


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

router.post('/requestFriendship/',function(req,res,next){
	User.requestFriend(req.body.senderID,req.body.requestedID,function(err,result){
		Notification({
				receiver: result.friender._id,
				sender:result.friend._id,
				refObject:'Friendship Request',
				message:"Ви предложи приятелство."
			})	.save();
	});
	return res.json("done")
})

router.post('/acceptFriendship/',function(req,res,next){
	User.requestFriend(req.body.senderID,req.body.requestedID,function(err,result){
		Notification({
				receiver: result.friender._id,
				sender:result.friend._id,
				refObject:'Friendship Request',
				message:"прие  предложението ви за  приятелство."
			})	.save();
	});
	return res.json("done")
})

module.exports = router;