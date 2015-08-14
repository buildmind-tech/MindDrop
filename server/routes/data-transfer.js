var fs=require('fs');
var multer  = require('multer');
var multipart = require('connect-multiparty');

var mime = require('mime');
var moment=require('moment');
var uuid = require('node-uuid');

var mongoose = require('mongoose');
var File = mongoose.model('File');
var User = mongoose.model('User');

module.exports=function(router){
	var upload = multer({ dest: '/uploads/' });
	router.post('/upload',multipart({
		uploadDir:'/uploads/'
	}),function(req, res,next){ // form fields
	   	// console.log(req);
	   	var auth=JSON.parse(req.body.data);
	   	User.findOne({username:auth.username,userid:auth.userid,usersession:auth.usersession},function(err,user){
	   		if (user) {
	   			var file_id=uuid.v4();

	   			if (user.freespace > 0){
	   				var file = new File({
				   		name: req.files.file.name,
						mime: req.files.file.type,
						path: req.files.file.path,
						size: req.files.file.size,
						uuid: file_id,
						views: 0,
				   	})

				   	file.save(function(err){
				   		if (err) return;
				   		res.send({
				   			name: req.files.file.name,
							mime: req.files.file.type,
							path: req.files.file.path,
							size: req.files.file.size,
							uuid: file_id,
				   		}).end()
				   	})

				   	user.files.push(file_id);
				   	user.freespace-=req.files.file.size;

				   	user.save();
	   			}
	   			else {
	   				res.status(402); // out of space
	   			} 

			   	
	   		}

	   		else {
	   			res.status(401); // unauthorized
	   		}
	   	})

	   	
	});



	router.get('/download/:id',function(req, res, next){
		var id=req.params.id;
		if (id) {	
			File.findOne({uuid:id},function(err,file){
				if (file) {
					res.type(file.mime);    	
		  			fs.createReadStream(file.path).pipe(res);
				}
				else {
					res.status(404).end()
				}
			})
		}
		else {
			res.status(404).end()
		}
	})
}