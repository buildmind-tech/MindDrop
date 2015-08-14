var mongoose = require('mongoose');
var User = mongoose.model('User');

var uuid = require('node-uuid');

module.exports=function(router){
	router.post('/login', function(req, res, next) {
	  var userinfo = req.body.userinfo;
	  var password = req.body.password;
	  var deviceType = req.body.deviceType;

	  User.findOne({$or:[{username:userinfo},{email:userinfo}]},function(err,data){
	    if(err){ return next(err); }
	    if(!data) {
	      res.status(401).end();
	    }
	    else {
	      if(data.password==password) {
	        var sessionID=uuid.v4();
	        if (deviceType=="mobile") {
	          data.usermobilesession=sessionID;
	        }
	        else {
	          data.usersession=sessionID;
	        }
	        data.save();
	        var sendback={
	          username:data.username,
	          usernickname:data.nickname,
	          userid:data.userid,
	          usersession:sessionID
	        }
	        res.status(200).send(sendback).end();
	      }
	      else {
	        res.status(402).end();
	      }
	    }
	  });
	});

	router.post('/auth', function(req, res, next) {

	  var username = req.body.username;
	  var userid = req.body.userid;
	  var usersession = req.body.usersession;
	  var deviceType=req.body.deviceType;
	  
	  User.findOne({username:username},function(err,data){
	    if(err){ return next(err); }
	    if(!data) {
	      res.status(401).end();
	    }
	    else if ((deviceType=="mobile" && data.usermobilesession==usersession) || data.usersession==usersession) {
	      res.status(200).end();
	    } 
	    else {
	        res.status(401).end();
	    }
	  })
	});

	router.post('/register', function(req, res, next) {
	  var username = req.body.username;
	  var email = req.body.email;
	  var password = req.body.password;
	  var usersession = uuid.v1();
	  var invitecode=req.body.invitecode;
	  var usersave = new User({
	    username: username,
	    email: email,
	    password:password,
	    usersession:usersession,
	  });

	  if (invitecode=='s-class') {
	    User.find({email:email},function(err,data){
	      if(err){ return next(err); }
	      if(data.length==0) {
	        User.find({username:username},function(err,data){
	          if(err){ return next(err); }
	          if(data.length==0) {
	            usersave.save(function(err, post){
	              if(err){ return next(err); }
	              var sendback= {
	                  username:req.body.username,
	                  usersession:uuid.v4()
	                }
	              res.status(200).send(sendback).end();
	            });
	          }
	          else {
	            res.status(402).end();
	          }
	        });
	      }
	      else {
	        res.status(401).end();
	      }
	    });
	  }
	  else {
	    res.status(400).end();
	  }
	});

	router.post('/logout', function(req, res, next) {
	  var username = req.body.username;
	  var query = {username:username};
	  User.findOne(query,function(err,data){
	    if(err){ return next(err); }
	    if (data) {
	      if (req.body.type=="mobile") {
	        data.usermobilesession='';
	        data.iosToken='';
	      }
	      else {
	        data.usersession='';
	      }
	      data.iosToken='';
	      data.save();
	    }
	  });
	  res.status(200).end();
	});
}