var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Challenge = require('../models/challenges');
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
    var newChallenge = new Challenge({
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
    // for(var i = 0; i < 100; i++) {
    //  createTestChallenge(req.params.userID,i);
    // }

    //TODO add pagination and hide the user password from the json !!! possible exploit
    Challenge
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
    Challenge.find(function (err, challenge) {
        res.json(challenge);
    });
});

router.get('/clear', function (req, res, next) {
    Challenge.remove(function (err) {
        res.send('cleared');
    })
});

router.post('/create', function (req, res, next) {

    var title = req.param('name');
    var description = req.param('description');
    var friends = req.param('friends');
    var location = req.param('location');

    var currentChallenge = new Challenge({
        title: title,
        description: description,
        location: {
            lat: location.lat,
            lng: location.lng
        },
        _creator: req.param('_creator'),
        invitedUsers: friends

    });

    // res.send('ok ?')
    currentChallenge.save(function (err, challenge) {
        res.send('saved');
    });

});

// router.post('/invite/:from/:to', function (req, res, next) {
//
//     var from = req.param('from');
//     var to = req.param('to');
//
//
// });

module.exports = router;
