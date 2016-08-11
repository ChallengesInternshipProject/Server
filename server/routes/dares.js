var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Dare = require('../models/dares');
var moment = require('moment')
moment.locale('bg')

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

router.get('/timeline/:userID', function(req, res, next) {
	//TODO add pagination and hide the user password from the json !!! possible exploit
	Dare
	.find({
		title : {$ne : null},
		description : { $ne : null},
		// startDate :{
		//  $lt : new moment().format()
		// },
		// endDate : {
		//  $gt : new moment().format()
		// }
	})
	.populate('_creator')
	.exec(function (err, post) {
		if (err) return next(err);
		post = CalculateTimes(post);
		res.json(post)
	});

	
	
});


router.get('/', function (req, res, next) {
  Dare.find(function (err, challenge) {
		res.json(challenge);
	});
});

router.get('/clear', function (req, res, next) {
  Dare.remove(function (err) {
		res.send('cleared');
	})
});

router.post('/create', function (req, res, next) {
	var dare = new Dare(req.body);
	dare.save(function (err, challenge) {
		res.json(challenge);
	});

});



module.exports = router;
