angular.module('minddrop.core',[])

.factory('$MindDrop',function(Upload,$db,$rootScope){


	var fs=require('fs');
	var self=this;

	var upload=function(files){

		var isDirectory=fs.statSync(files[0].path).isDirectory();
			console.log(files);

		if (isDirectory) {
			return;
		}
		else if (files[0].size > 20*1024*1024) {
			alert('The file is too big! Currently alpha release only support 20MB single file.')
		}
		else {

			var f = new File(files[0].path,files[0].name);
        	var uploadFiles=[f];

        	console.log(uploadFiles);

			Upload.upload({
	          url: "http://drop.buildmind.org/upload",
	          file: uploadFiles,
	        }).progress(function(evt) {
	          // console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.file[0].name);
	          $rootScope.$broadcast('upload:progress:update',{
	          	complete:(evt.loaded/evt.total)
	          })
	        }).success(function(data, status, headers, config) {
	          // file is uploaded successfully
	          // console.log(data);
	          data.localPath=files[0].path;
	          var db=$db.getRecentFileDb();
	          db.push(data);

	          $rootScope.$broadcast('upload:complete')
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