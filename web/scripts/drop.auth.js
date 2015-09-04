/**
* $drop Module
*
* Description
*/
angular.module('MindDrop.drop', []).
factory('$drop', ['$q','$http',function($q,$http){

	var self=this;

	var auth=function(){
		var q=$q.defer();

		$http.post('http://drop.buildmind.org/login',{
          userinfo:'tonychol',
          password:'666666'
        }).success(function(data){
	        window.localStorage['username']=data.username;
	        window.localStorage['userid']=data.userid;
	        window.localStorage['usersession']=data.usersession;
	        q.resolve()
        }).error(function(err){
        	q.reject()
        })

        return q.promise;
	}

	var get=function(type){
		var q=$q.defer();

		if (!window.localStorage['usersession']) {
			$http.post('http://drop.buildmind.org/login',{
	          userinfo:'tonychol',
	          password:'666666'
	        }).success(function(data){

		        window.localStorage['username']=data.username;
		        window.localStorage['userid']=data.userid;
		        window.localStorage['usersession']=data.usersession;

		        self.get(type);

	        }).error(function(err){
	        	return;
	        })

		}
		else {
			$http.post('http://drop.buildmind.org/api/get-file/'+type,{
				username:window.localStorage['username'],
		        userid:window.localStorage['userid'],
		        usersession:window.localStorage['usersession'],
			}).success(function(data){
				q.resolve(data)
			}).error(function(err){
				q.reject(err)
				window.localStorage['usersession']="";
				self.get(type);
			})
		}

		

		return q.promise;
	}

	self={
		auth:auth,
		get:get
	}

	return self;
}])

.run(function($drop){
    $drop.auth().then(function(){
        $drop.get('.*').then(function(files){
            console.log(files);
        }) // alll types
    });
    // use $drop.get(type) to get files of specific types
    // all .*
    // image image
})