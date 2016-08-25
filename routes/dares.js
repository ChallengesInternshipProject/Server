var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Dare = require('../models/dares');
var moment = require('moment')
moment.locale('bg');
var $q = require('q');
var File = require("../models/files");

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

function createTestChallenge(userID,date){
	var newChallenge = new Dare({
		_creator : userID,
		description : "Feed a stray cat",
		startDate : new moment().add(date+2,'d').format(),
		endDate : new moment().add(date+4,'d').format(),
		title: "New Dare :" + new moment().add(date+2,'d').format(),
	})
	console.log('New CHallenge')
	newChallenge.save();
}

router.get('/list/', function(req, res, next) {
	//TODO add pagination and hide the user password from the json !!! possible exploit
	Dare
	.find(JSON.parse(req.query.data))
	.sort({endDate : -1})
	.populate('_creator')
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
		// for ( var index in req.body.files) {
		// 	console.log(index);
		// 	// var FileEnt = new File({
		// 	// 	object : "dare",
		// 	// 	objectId :result._id,
		// 	// 	fileString : req.body.files[index],
		// 	// 	fileType : "img",
		// 	// 	uploadedBy:req.body._creator
		// 	// });
		// 	// FileEnt.save(function(err,res){
		// 	// 	console.log(res._id);
		// 	// })
		// }
		res.json(result);
	})
});



module.exports = router;
