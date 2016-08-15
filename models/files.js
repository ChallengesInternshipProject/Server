var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var multer = require('multer');
var $q = require('q');

var fileSchema = new Schema({
	object : String,
	objectId : String,
	filename : String,
	fileType : String,
	//uploadedBy:{type: Schema.Types.ObjectId,ref:'User'},
});

fileSchema.methods.uploadFile  = function(req,filename,filefield,objectName,objectId,uploadedBy){
	var file = this;
	var fs = require('fs')
	var path = '../uploads/smth14';
	var storage = multer.diskStorage({
		destination : function(req,file,callback){
			callback(null, path);
		},
		filename : function(req, file, callback){
			callback(null, file.fieldname  + "-" + Date.now())
		}
	})
	var result = $q.defer();
	var upload = multer({ storage : storage}).any("fileInput");
	fs.stat(path, function(err,stats){
		if (err){
			var mode = 0777 & ~process.umask();
			fs.mkdirSync(path,mode)
		}
		console.log(req)
		upload(req,null,function(err) {

			if(err) {
				result.reject(err);
			}

			file.object = objectName;
			file.objectId = objectId;
			file.name = filename;
			file.type = "fileType";
			file.save(function(err,resultFile){
				if (err) { return next(err);};
				result.resolve(resultFile)
			})
			
		});
	});
	return result.promise;
}

var File = mongoose.model('File', fileSchema);

module.exports = File;