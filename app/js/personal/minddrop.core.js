angular.module('minddrop.core',[])

.factory('$MindDrop',function(Upload){


	var fs=require('fs');
	var self=this;

	var upload=function(files){

		var isDirectory=fs.statSync(files[0].path).isDirectory();
			console.log(files);

		if (isDirectory) {

		}
		else {

			var f = new File(files[0].path,files[0].name);
        	var uploadFiles=[f];

        	console.log(uploadFiles);

			Upload.upload({
	          url: "http://drop.buildmind.org/upload",
	          file: uploadFiles,
	        }).progress(function(evt) {
	          console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.file[0].name);
	        }).success(function(data, status, headers, config) {
	          // file is uploaded successfully
	          console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
	        }).error(function(err){
	          console.log(err);
	        })
		}
	}


	self={
		upload:upload
	}

	return self;
})