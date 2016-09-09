var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var friends = require('mongoose-friends')
var userSchema = new Schema({
    // id: Number,
    email : String,
    // password is encrypted with bcrypt
    password : String,
    name : String,
    picture : String,
    phone : String,
    address : String,
    dateOfBirth : Date,
    gender : String,
    interests : Array,
    socialNetworks : Array,
    avatar : {
        type : String,
        default : 'images/avatar.png'
    } ,
    isOnline : {
        type : Boolean,
        default : true
    },
    country : {
        type : String,
        default : "BG"
    },
    town : {
        type : String,
        default : "София"
    },
    // //The location can be a String
    // location: {
    //     lat: Number,
    //     lon: Number
    // },
    // phone: Number,
    // dateOfBirth: Date,
    // registrationDate: Date,
    // lastLogin: Date,
    // // the friends are a Array with user ID's
    // friends: Array

    //TODO limits maximum and minimum lenght of strings
});

userSchema.plugin(friends());

var User = mongoose.model('User', userSchema);

module.exports = User;
