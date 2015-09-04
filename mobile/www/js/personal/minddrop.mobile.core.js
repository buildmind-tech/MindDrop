/**
* minddrop.mobile.dore Module
*
* Description
*/
angular.module('minddrop.mobile.core', []).
factory('$drop', ['$rootScope','$http','$q','$cordovaFileTransfer', function($rootScope,$http,$q,$cordovaFileTransfer){

	var server="http://drop.buildmind.org"

	var get=function(type){
		var q=$q.defer();
		$http.post('http://drop.buildmind.org/api/get-file/'+type,{
			username:window.localStorage['username'],
	        userid:window.localStorage['userid'],
	        usersession:window.localStorage['usersession'],
		}).success(function(data){
			q.resolve(data)
		}).error(function(err){
			q.reject(err)
		})

		return q.promise;
	}

	var getPicture=function(sourceType){
		var q=$q.defer();
		if (navigator.camera) {
			
			var options={ quality : 75,
				destinationType : Camera.DestinationType.NATIVE_URI,
				sourceType : sourceType,
				allowEdit : true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 100,
				targetHeight: 100,
				saveToPhotoAlbum: true
			};



			navigator.camera.getPicture(
			function(uri){
				q.resolve(uri)
			}, function(err){
				q.reject(err);
			},options)

			
		}
		else {
			q.reject();
		}

		return q.promise;
	}

	var upload=function(filePath){
		var q=$q.defer();
		var options={
			params:{data:{username:window.localStorage['username'],userid:window.localStorage['userid'],usersession:window.localStorage['usersession']}}
		};
		$cordovaFileTransfer.upload(server+'/upload', filePath, options)
		.then(function(result) {
		// Success!
			q.resolve(result)
		}, function(err) {
		// Error
			q.reject(err);
		}, function (progress) {
		// constant progress updates
			$rootScope.$broadcast('upload:process',progress)
		});
		return q.promise;
	}

	return {
		get:get,
		getPicture:getPicture,
		upload:upload
	}
}])

.directive('dropSrc', ['$rootScope', function($rootScope){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope, element, attrs, controller) {

			if (attrs.dropSrc) {
				element[0].src=attrs.dropSrc
			}

			element.bind('error',function(e){
				element[0].src="img/ionic.png"
			})
		}
	};
}])

.filter('freespace',function(){
	return function(input){
		return Math.ceil10((2-input/(1024*1024*1024)), -2)+"GB";
	}
})