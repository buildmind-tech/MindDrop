/**
* minddrop.mobile.dore Module
*
* Description
*/
angular.module('minddrop.mobile.dore', []).
factory('$drop', ['$rootScope','$http','$q', function($rootScope,$http,$q){

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

	return {
		get:get
	}
}])