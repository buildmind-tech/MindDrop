angular.module('window.db',[])

.run(function($db,$contextMenu){
	var low = require('lowdb');
	global.recentFileDb=low('dbs/recent.json');
	$db.setDb(global.recentFileDb);
	$contextMenu.constructMenu();
})

.factory('$db',function(){
	var self=this;
	var db;

	var setDb=function(_db){
		db=_db;
		// console.log(db);
		
	}

	var getRecentFileDb=function(){
		if (db) {
			return db('recent');
		}
		else {
			return false;
		}
		
	}

	var getPreferences=function(){
		if (db) {
			return db('preferences');
		}
		else {
			return false;
		}
	}

	self={
		setDb:setDb,
		getRecentFileDb:getRecentFileDb,
		getPreferences:getPreferences
	}

	return self;
})
