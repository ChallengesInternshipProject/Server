var express = require('express');
var router = express.Router();
var Notification = require('../models/notifications');
var ObjectID = require('mongoose').Types.ObjectId;
var $q = require('q');
router.get('/:userID',function(req,res,next){
	var userID = new ObjectID(req.params.userID);
	console.log(userID)
	Notification
	.find({receiver:{$eq:userID}})
	.sort({createdOn: -1})
	.populate('sender')
	.populate('receiver')
	.exec(function (err, result) {
		var notifications = result;

		if (err) return next(err);
		var promise = $q.defer();
		console.log("LEngth");
		console.log(notifications.length);
		for (var i  = 0 ;i < notifications.length; i ++){
			console.log(notifications[i])
			switch(notifications[i].refObject){
				case 'dare':
					var Dare = require('../models/dares');
					Dare.findOne({_id:notifications[i].refObjectID}).exec(function(err,dare){
						notifications[i]["dare"] = dare;
						notifications[i]['test'] = "sjdij";
					})

				break;
				default:
				break;
			}
		}
		promise.resolve(notifications)
	
		promise.promise.then(function(finalResult){
			res.json(finalResult)
		})
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
