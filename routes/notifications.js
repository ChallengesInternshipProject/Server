var express = require('express');
var router = express.Router();
var Notification = require('../models/notifications');
var User = require('../models/users');
var Dare = require('../models/dares')
var ObjectID = require('mongoose').Types.ObjectId;
var $q = require('q');
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
			model : 'Dare'
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
module.exports = router;
