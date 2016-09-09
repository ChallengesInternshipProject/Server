"use strict";
var express = require('express');
var router = express.Router();
var Dare = require('../models/dares');
var moment = require('moment');
moment.locale('bg')

class Calendar{
	constructor(userID,year,month,context){
		this.getCalendarDays(year,month);
		// if(context != undefined){
		// 	this[context].apply(this,arguments);
		// }
	}

	// build calendar
	 getCalendarDays(year,month){
		//Get first date of the month
		//M is array and we have to subtract 1
		month -=1;

		this.days = [];
		var currentDate = new moment({d:1,M:month,y:year});
		this.currentMonth = currentDate.format('MMMM').toUpperCase()
		this.month = currentDate.format('M')
		this.nextMonth = new moment(currentDate.format()).add(1,'M').format('M')
		this.prevMonth = new moment(currentDate.format()).subtract(1,'M').format('M')
		this.year = year;

		var days = currentDate.daysInMonth();

		//add emtpy days
		//Calculate days after monday
		var emtpyDaysInfront = Number(currentDate.format('E'))-1;
		//Change starting day
		currentDate=currentDate.subtract(emtpyDaysInfront,'d');

		days +=emtpyDaysInfront; 
		//Set starting date to the monday of the 1st week
		this.startDate=currentDate.format()
		//calculate the last day
		this.toDate = new moment(currentDate.format()).add(days,'d');
		//Add days so the days can end on sunday
		days +=  Math.abs(Number(this.toDate.format('E'))-8);
		//Calculate the end date
		this.toDate = new moment(this.startDate).add(days,'d').format()
		this.daysNumber = days;

		for(var i = 0; i< days; i++){
			let currentDay = {
				date:currentDate.format(),
				day:currentDate.format('D'),
				hasEvents:false,
				isFromCurrentMonth:	 month+1 ==  currentDate.format('M') ? true : false,
			}
			this.days[currentDate.format('D/M/YYYY')]=currentDay;
			console.log(currentDate.format())
			currentDate.add(1,'d');
		}
		
	}

	//Strigify the class
	parseEvents(){
		
		this.jsonResult = {
			startDate:this.startDate,
			toDate:this.toDate,
			prevMonth : this.prevMonth,
			nextMonth : this.nextMonth,
			currentMonth :this.currentMonth,
			weeks : Math.ceil(this.daysNumber/7),
			daysNumber : this.daysNumber,
			year :this.year,
			month:this.month,
			days:[]
		}
		for(var day in this.days){
			this.jsonResult.days.push(this.days[day])
		}
		
	}
}
//End of class definition


//Create Calendar
router.get('/:userID/:year/:month',function(req,res,next){
	var eventCalendar = new Calendar(
		req.params.userID,
		req.params.year,
		req.params.month
	);
	Dare
	.find({
		_creator:req.params.userID,
		title : {$ne:null},
		startDate:{$gte:moment(eventCalendar.startDate).format()},
		endDate:{$lte:moment(eventCalendar.toDate).format()}
	})
	.populate('_creator')
	.exec(
		function (err,post) {
			post.forEach(function(event,index){
				eventCalendar.days[moment(event.startDate).format('D/M/YYYY')].hasEvents=true;
			})
			eventCalendar.parseEvents()
			res.json(eventCalendar.jsonResult);
		}
	);

});
//Get Events for month
router.get("/events/:userID/:year/:month/:day",function(req,res,next){
	// var eventCalendar = new Calendar(
	// 	req.params.userID,
	// 	req.params.year,
	// 	req.params.month
	// );
	let currentDate = new moment({
		y:req.params.year,
		M:req.params.month-1,
		d:req.params.day
	});
	
	let from= currentDate.format();
	let to = currentDate.add(1,'d').format();

	Dare
	.find({
		title : {$ne:null},
		startDate:{
				$gt:from,
				$lt:to
		}

	})
	.populate('_creator')
	.exec(
		function (err,post) {
			res.json(post);
		}
	);
})
module.exports = router;
