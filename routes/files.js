var express = require('express');
var router = express.Router();
var File = require('../models/files')
/* GET home page. */
router.get('/', function(req, res, next) {
		res.render('files', {
			title: 'Files test form',
		});
});
router.post('/', function(req, res, next) {
	file = new File();
	console.log(req)
	file.uploadFile(req,"testFile","fileInput","testObj","testObjID","me").then(function(result){
		res.json(result)
	}).catch(function(err){
		return next(err);
	})
	

});

module.exports = router;