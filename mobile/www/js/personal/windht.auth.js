/**
* windht.auth Module
*
* Description
*/
angular.module('windht.auth', [])
.factory('$auth',function($http,$q,$rootScope){
      var self=this;

      var login=function(form){
        var q=$q.defer();

        $http.post('http://drop.buildmind.org/login',{
          userinfo:form.userinfo,
          password:form.password
        }).success(function(data){
        	$rootScope.$broadcast('authenticated')

          window.localStorage['username']=data.username;
          window.localStorage['userid']=data.userid;
          window.localStorage['usersession']=data.usersession;
          window.localStorage['usernickname']=data.usernickname;

          window.localStorage['loggedin']='true';
          q.resolve(data);
        }).error(function(err){
          q.reject(err);
        })

        return q.promise;
      }

      var auth=function(){
        var q=$q.defer();



        if (window.localStorage['usersession']) {
        	$http.post('http://drop.buildmind.org/auth',{
	          	username:window.localStorage['username'],
	          	userid:window.localStorage['userid'],
	          	usersession:window.localStorage['usersession'],
	        }).success(function(data){
	        	$rootScope.$broadcast('authenticated')
	        	window.localStorage['loggedin']='true';
	          	q.resolve(data);
	        }).error(function(err){
	          	// window.localStorage['username']='';
	          	// window.localStorage['userid']='';
	          	window.localStorage['loggedin']='false';
	          	window.localStorage['usersession']='';
	          	q.reject(err);
	        })
        }
        else {
        	q.reject();
        }
        return q.promise;
      }

      var register=function(){
        var q=$q.defer();

        $http.post('http://drop.buildmind.org/register',{
          username:form.username,
          email:form.email,
          password:form.password,
        }).success(function(data){
          q.resolve(data);
        }).error(function(err){
          q.reject(err);
        })
        return q.promise;
      }

      var logout=function(){
        var q=$q.defer();

        $http.post('http://drop.buildmind.org/logout',{
          username:window.localStorage['username'],
          userid:window.localStorage['userid'],
          usersession:window.localStorage['usersession'],
        }).success(function(data){
          window.localStorage['loggedin']='false';
          window.localStorage['username']='';
          window.localStorage['userid']='';
          window.localStorage['usersession']='';
          q.resolve(data);
        }).error(function(err){
          q.reject(err);
        })
        return q.promise;
      }

      self={
        login:login,
        auth:auth,
        logout:logout,
        register:register
      }

      return self;
    })