var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;
var challengeSchema = new Schema({
    //The id can be a number or a string
    // id: String,
    title: String,
    description: String,
    location: {
        lat: Number,
        lng: Number
    },
    //The price can be Zer0
    price: {
        min: Number,
        max: Number
    },
    dateCreated: {type:Date},
    startDate: {type:Date,default:moment().add(1,'d')},
    //The end date must be after the start date :O
    endDate: {type:Date,default:moment().add(2,'d')},
    isPublic: Boolean,
    invitedUsers: Array,
    watchingUsers: Array,
    //users who accepted the challenge
    acceptedUsers: Array,
    //Comments about the challenge.
    comments: Array,
    
    _creator:{type: Schema.Types.ObjectId,ref:'User'},
    likes:{type:Number,default:50}, //TODO - must be in different collection
    pictures:{type:Array, default:['images/feedCat.jpg','images/feedCat2.jpg']},//TODO - create files upload 
    comments:{type:Number,default:100}, //TODO use differente collection
    city:{type:String,default:'Sofia'},

    //TODO limits maximum and minimum lenght of strings
});

var Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
