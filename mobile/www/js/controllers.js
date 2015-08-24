angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$http,$drop,$ionicBackdrop,$ionicLoading,$ionicPopover,$ionicActionSheet) {
  $scope.currentSelection=".*";

  $ionicModal.fromTemplateUrl('templates/setting.html', {
      scope: $scope
  }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.showSetting=function(){
    $scope.modal.show();
  }

  $scope.closeSetting=function(){
    $scope.modal.hide();
  }


  $scope.User={};
  $scope.$on('authenticated',function(){
    $scope.User.name=window.localStorage['username'];
    $scope.User.session=window.localStorage['usersession'];
    $drop.get($scope.currentSelection).then(function(data){
      if (data){
        $scope.files=data;
      }
      else {
        $scope.files=[]
      }
    })
  })




  $scope.doRefresh = function() {
    $drop.get($scope.currentSelection).then(function(data){
      console.log(data);
      if (data){
        $scope.files=data;
      }
      else {
        $scope.files=[]
      }
      $scope.$broadcast('scroll.refreshComplete');
    },function(err){
      $scope.$broadcast('scroll.refreshComplete');
    })
  };

  $scope.chooseType=function(type){
    $scope.currentSelection=type;
    $ionicBackdrop.retain();
    $ionicLoading.show({
      template: '<ion-spinner icon="circles"></ion-spinner><br>Loading Drops'
    });
    $drop.get($scope.currentSelection).then(function(data){
      console.log(data);
      $ionicBackdrop.release();
      $ionicLoading.hide();
      if (data){
        $scope.files=data;
      }
      else {
        $scope.files=[]
      }

    },function(err){
      $ionicBackdrop.release();
      $ionicLoading.hide();
    })
  }

  $scope.popover = $ionicPopover.fromTemplateUrl("templates/upload-popover.html", {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

  $scope.uploadType=function(type){
    switch (type) {
      case "image":
        $ionicActionSheet.show({
          buttons: [
            { text: 'Library' },
            { text: 'Take Photo or Video' }
          ],
          titleText: 'Choose Picture From',
          cancelText: 'Cancel',
          cancel: function() {
              // add cancel code..
          },
          buttonClicked: function(index) {
            console.log(index);
            switch (index) {
              case 0:
                break;
              case 1:
                break;
            }
            return true;
          }
        });
        break;
      case "audio":
        $ionicActionSheet.show({
          buttons: [
            { text: 'Library' },
            { text: 'Recording' }
          ],
          titleText: 'Choose Audio From',
          cancelText: 'Cancel',
          cancel: function() {
              // add cancel code..
          },
          buttonClicked: function(index) {
           return true;
          }
        });
        break;
    }
    $scope.popover.hide();
  }

  

  // For example's sake, hide the sheet after two seconds

  
})

.controller('PlaylistsCtrl', function($scope) {

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
