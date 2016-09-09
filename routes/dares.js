var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Dare = require('../models/dares');
var Notification = require('../models/notifications');
var User = require('../models/users')
var File = require("../models/files");

var moment = require('moment')
moment.locale('bg');
var $q = require('q');

function CalculateTimes(challenges){
	var result =[];
	for(challenge in challenges){
		var currentChallenge = challenges[challenge].toObject();
		currentChallenge['timeElapsed'] = moment(currentChallenge['startDate']).fromNow()
		currentChallenge['timeLeft'] = moment(currentChallenge['endDate']).fromNow()
		result.push(currentChallenge)
	} 
	return result
}


router.get('/list/', function(req, res, next) {
	//TODO add pagination and hide the user password from the json !!! possible exploit
	Dare
	.find(JSON.parse(req.query.data))
	.sort({endDate : -1})
	.populate([
		{
			path : '_creator',
			model : 'User'
		},
		{
			path : 'pictures',
			model :  'File'
		},
		{
			path : 'invitedUsers',
			model : 'User'
		}
	])
	.exec(function (err, post) {
		if (err) return next(err);
		post = CalculateTimes(post);
		res.json(post)
	});
	
});


router.get('/', function (req, res, next) {
		Dare.find(function (err, dare) {
		res.json(dare);
	});
});

router.get('/clear', function (req, res, next) {
		Dare.remove(function (err) {
		res.send('cleared');
	})
});

router.post('/create', function (req, res, next) {
	var dare = new Dare(req.body);
	var newDare = $q.defer()
	//Save the dare
	dare.save(function (err, dare) {
		newDare.resolve(dare);
	});

	//Save the files 
	newDare.promise.then(function(result){
		//Create Notifications for Invited Users 
		
		for(var i = 0; i < result.invitedUsers.length; i ++) {
			Notification({
				receiver :result.invitedUsers[i],
				sender:result._creator,
				refObject:'dare',
				refObjectID:result._id,
				message:"Ви Предизвика."
			})	.save();
			
		}

		for ( var index in req.body.fileData) {
			var FileEnt = new File({
				object : "dare",
				objectId :result._id,
				fileString :  req.body.fileData[index],
				fileType : "img",
				uploadedBy:req.body._creator
			});
			
			FileEnt.save(function(err,resFile){
				Dare.findById(result._id).exec(function(err,res){
					res.uploadFile(resFile._id);
				})
			})
		}
		res.json(result);
	})
});

router.get('/get/', function(req,res,next){
	
	Dare
	.findById(req.query.dareID)
	.populate([
		{
			path : '_creator',
			model : 'User'
		},
		{
			path : 'pictures',
			model :  'File'
		},
		{
			path : 'invitedUsers',
			model : 'User'
		},
		{
			path : 'proves',
			model : 'File',
			populate : {
				path : "uploadedBy",
				model : "User"
			}
		}
	])
	.exec(function (err, result) {
		if (err) return next(err);
		res.json(result)
	});
})

router.post('/prove/', function(req,res,next){

	var FileEnt = new File(req.body);
		FileEnt.save(function(err,resFile){
			Dare.findById(req.body.objectId).exec(function(err,resultDare){
				resultDare.uploadProve(resFile._id);
			
				var notification = new Notification({
					receiver: resultDare._creator,
					sender:req.body.uploadedBy,
					refObject:'dare',
					refObjectID:resultDare._id,
					message:"Изпълни предизвикателство",
				
				});
				notification.save()
				res.json(resFile._id)
			})
		})
	
})


module.exports = router;
