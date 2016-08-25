var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileSchema = new Schema({
	object : String,
	objectId : String,
	fileString : String,
	fileType : String,
	uploadedBy:{type: Schema.Types.ObjectId,ref:'User'},
});

var File = mongoose.model('File', fileSchema);
module.exports = File;