angular.module('minddrop.core',[])

.directive('fileInput',function($MindDrop){
	return {
		restrict:"A",
		scope: "&",
		link:function(scope, element, attrs){
			element.bind('change',function(ev){
				$MindDrop.upload(element[0].files);
			})
		}
	}
})


.factory('$MindDrop',function(Upload,$db,$rootScope,$filter,$broadcast){

	var fs=require('fs');
	var archiver = require('archiver');
	var self=this;

	var upload=function(files){

		var isDirectory=fs.statSync(files[0].path).isDirectory();
			console.log(files);

		if (files[0].size > 20*1024*1024) {
			alert('The file is too big! Currently alpha release only support 200MB single file.')
		}
		else if (isDirectory) {
			var timestamp=$filter('date')(new Date(), 'yyyy-MM-dd-HH-mm-ss');
			var output = fs.createWriteStream('./temp/'+files[0].name+'@'+timestamp+'.zip');
			var archive = archiver.create('zip', {}); // or archiver('zip', {});

			archive.pipe(output);
			archive.bulk([
			  { 
			  	expand: true, 
			  	cwd: files[0].path, 
			  	src: ['*'] 
			  }
			]);
			archive.finalize();

			output.on('close', function () {
			    console.log(archive.pointer() + ' total bytes');
			    console.log('archiver has been finalized and the output file descriptor has closed.');

			    var f = new File(process.cwd()+'\\temp\\'+files[0].name+'@'+timestamp+'.zip',files[0].name+'.zip');
	        	var uploadFiles=[f];
	        	console.log(uploadFiles);

				Upload.upload({
		          url: "http://drop.buildmind.org/upload",
		          file: uploadFiles,
		          data:{username:window.localStorage['username'],userid:window.localStorage['userid'],usersession:window.localStorage['usersession']}
		        }).progress(function(evt) {
		          // console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.file[0].name);
		          $rootScope.$broadcast('upload:progress:update',{
		          	complete:(evt.loaded/evt.total)
		          })
		        }).success(function(data, status, headers, config) {
		          // file is uploaded successfully
		          // console.log(data);
		          data.localPath=process.cwd()+'\\temp\\'+files[0].name+'@'+timestamp+'.zip';

		          data.createTime=new Date();
		          var db=$db.getRecentFileDb();
		          db.unshift(data);

		          $rootScope.$broadcast('upload:complete')
		        }).error(function(err){
		          console.log(err);
		        })
			});

			return;
		}	
		else {

			var f = new File(files[0].path,files[0].name);
        	var uploadFiles=[f];

        	console.log(uploadFiles);

			Upload.upload({
	          url: "http://drop.buildmind.org/upload",
	          file: uploadFiles,
		      data:{username:window.localStorage['username'],userid:window.localStorage['userid'],usersession:window.localStorage['usersession']}
	        }).progress(function(evt) {
	          // console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.file[0].name);
	          $rootScope.$broadcast('upload:progress:update',{
	          	complete:(evt.loaded/evt.total)
	          })
	        }).success(function(data, status, headers, config) {
	          // file is uploaded successfully
	          // console.log(data);
	          data.localPath=files[0].path;
	          data.createTime=new Date();
	          var db=$db.getRecentFileDb();
	          db.unshift(data);

	          $rootScope.$broadcast('upload:complete')
	        }).error(function(err){
	          console.log(err);
	        })
		}
	}


	var shareScreen=function(){
	    $broadcast.start();
	}

	var stopScreenSharing=function(){
		$broadcast.stop();
	}

	self={
		upload:upload,
		shareScreen:shareScreen,
		stopScreenSharing:stopScreenSharing
	}

	return self;
})