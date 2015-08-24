/**
* MindDrop.services Modul
*
* Description
*/
angular.module('MindDrop.services', [])
.factory('$login', ['$rootScope','$ionicModal','$auth', function($rootScope,$ionicModal,$auth){

	var $scope=$rootScope.$new();

	$ionicModal.fromTemplateUrl('templates/login.html', {
	    scope: $scope
	}).then(function(modal) {
	    $scope.modal = modal;
	});

	$scope.hide = function() {
		$scope.modal.hide();
	};

	$scope.open = function() {
		$scope.modal.show();
	};

	$scope.auth={};

	$scope.login=function(){
		$auth.login($scope.auth).then(function(){
			$scope.modal.hide();
		},function(err){
			console.log(err)
		})
	}

	var show=function(){
		$scope.modal.show();
	}

	var hide=function(){
		$scope.modal.hide();
	}

	return {
		show:show,
		hide:hide,
	}
}])