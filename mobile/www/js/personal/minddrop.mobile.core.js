/**
* minddrop.mobile.dore Module
*
* Description
*/
angular.module('minddrop.mobile.core', []).
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