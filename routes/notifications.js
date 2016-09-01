var express = require('express');
var router = express.Router();
var Notification = require('../models/notifications');
var User = require('../models/users');
var Dare = require('../models/dares')
var File = require('../models/files');
var ObjectID = require('mongoose').Types.ObjectId;
var $q = require('q');
var moment= require('moment');
moment.locale('bg');


router.get('/unseen/:userID',function(req,res,next){
	var userID = new ObjectID(req.params.userID);

	Notification
	.find({
		receiver:{
			$eq:userID
		},
		isSeen : {
			$eq : false
		}
	})
	.exec(function (err, result) {
		res.json(result);
	});
})

router.get('/:userID',function(req,res,next){
	var userID = new ObjectID(req.params.userID);

	Notification
	.find({receiver:{$eq:userID}})
	.sort({createdOn: -1})
	.populate([
		{
			path : "sender",
			model : 'User'
		},
		{
			path : 'receiver',
			model : 'User'
		},
		{
			path : 'refObjectID',
			model : 'Dare',
			populate : [
				{
					path: 'pictures',
					model:'File'
				}
			]
		}
	])
	.exec(function (err, result) {
		res.json(result);
	});

})

router.post("/", function(req,res,next){
	var notification = new Notification(req.body);
	notification.save(function(err,result){
		if (err) { return next(err);};
		res.json(result);
	})
})

router.post("/markasseen/", function(req,res,next){
	Notification.find({receiver: new ObjectID(req.body.userID),isSeen:false}).exec(function(err,res){
		for (var i = 0 ;  i < res.length; i++) {
			res[i].isSeen = true;
			res[i].save();
		}
	})
	res.json('');
})


module.exports = router;
