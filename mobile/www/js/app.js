// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic.service.core','ionic.service.analytics','ionic.service.deploy','starter.controllers','MindDrop.services','windht.auth','minddrop.mobile.core','minddrop.file.cell','ngCordova'])

.run(function($ionicPlatform,$auth,$ionicBackdrop,$ionicLoading,$login,$timeout,$ionicDeploy,$ionicAnalytics) {

  $ionicBackdrop.retain();
  $ionicLoading.show({
    template: '<ion-spinner icon="circles"></ion-spinner><br>Loading...'
  });

  $ionicPlatform.ready(function() {
    $ionicAnalytics.register();
    $ionicDeploy.check().then(function(hasUpdate) {
      console.log('Ionic Deploy: Update available: ' + hasUpdate);
    }, function(err) {
      console.error('Ionic Deploy: Unable to check for updates', err);
    });
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $timeout(function(){
    $auth.auth().then(function(){
      console.log('auth success!');
      $ionicBackdrop.release();
      $ionicLoading.hide();
    },function(err){
      console.log('auth error!');
      $ionicBackdrop.release();
      $ionicLoading.hide();
      $login.show();
    })
  },1000)

  


})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app');
});
