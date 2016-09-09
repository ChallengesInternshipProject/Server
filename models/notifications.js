var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
	receiver: {type: Schema.Types.ObjectId,ref:'User'},
	sender:{type:Schema.Types.ObjectId, ref : 'User'},
	refObject:{type:String},
	refObjectID:{type:String},
	message:{type:String},
	isSeen:{type:Boolean, default:false},
	createdOn:{type:Date, default: new Date()}
});

var Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
