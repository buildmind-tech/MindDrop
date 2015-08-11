angular.module('windht.RTC.broadcast',[])



.factory('$broadcast', function ($q,socket,$rootScope) {
	var self=this;

	window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
	window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
	window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
	window.URL = window.URL || window.mozURL || window.webkitURL;
	window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;

	// For broadcast
	var localCamera,localScreen,localAudio;
	// For viewer
	var remoteStream;

	var iceConfig = { 'iceServers': [
		{
			url:"turn:52.68.40.147:3478",
			username:"9dtech",
			credential:"9dtech",
		}
		// {
		// 	url:'stun:stun.l.google.com:19302'
		// },
	]};

	var peerConnections={};

	function guid() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();
	}

	var getScreen=function(){
		var d = $q.defer();

		if (localScreen) {
			d.resolve(localScreen);
			return;
		}

		var streamId;

		if (process.platform=='darwin') {
        	streamId='screen:'+gui.Screen.screens[0].id;
      	}
      	else {
        	streamId='screen:0';
      	}


		navigator.getUserMedia({
			audio: false, 
			video: {
				mandatory: {
			        chromeMediaSource: 'desktop', 
			        chromeMediaSourceId: streamId, 
			        maxWidth: 1920, 
			        maxHeight: 1080
			    }, 
			    optional:[]
			}
		}, function (stream) {
	    	localScreen=stream;
	    	d.resolve(stream);
	    }, function (error) {
	    	d.reject(error)
	    });

	    return d.promise;
	}

	var getStream=function (constraints) {
		var d = $q.defer();

		if (localCamera) {
			d.resolve(localCamera);
			return;
		}

		navigator.getUserMedia({
		    video: true,
		    audio: true
		}, function (stream) {
		    localCamera = stream;
		    // $rootScope.$broadcast('rtc:local:video:ready',stream);		    
		    d.resolve(localCamera);
		}, function (error) {
		    d.reject(error);
		});
		  
		return d.promise;
	}

	var getAudio=function(){
		var d = $q.defer();

		if (localAudio) {
			d.resolve(localAudio);
			return;
		}

		navigator.getUserMedia({
		    video: false,
		    audio: true
		}, function (stream) {
		    localAudio = stream;
		    // $rootScope.$broadcast('rtc:local:video:ready',stream);		    
		    d.resolve(localAudio);
		}, function (error) {
		    d.reject(error);
		});
		  
		return d.promise;
	}


	var requestBroadcast=function(id){
		peerConnections[id] = new RTCPeerConnection(iceConfig);

		peerConnections[id].onicecandidate=function(evt){
			if (evt.candidate) {
				console.log('localPeerConnection candidate generated!');
				socket.emit('rtc',{
					type:"remote:candidate",
					candidate:evt.candidate,
					// config:config,
					id:id,
				});
			}
		}

		peerConnections[id].onaddstream=function(evt){
			console.log('get remote stream');
		}

		peerConnections[id].createOffer(function (offer) {
		    pc.setLocalDescription(offer, function() {
		    	console.log('set local offer');
		        socket.emit('broadcast',{
		        	offer:offer,
		        	id:id,
		        })
		    }, function(err){console.log(err)});
		}, function(err){console.log(err)});
	}

	var responseBroadcast=function(id,remoteOffer,source){

		if (!peerConnections[id]) {
			peerConnections[id]={};
		}

		peerConnections[id][source] = new RTCPeerConnection(iceConfig);

		peerConnections[id][source].oniceconnectionstatechange = function(ev) { 
		    if(ev.currentTarget.iceConnectionState == 'disconnected') {
		        peerConnections[id][source].close();
		        delete peerConnections[id][source];
		    }
		};

		peerConnections[id][source].onicecandidate=function(evt){
			if (evt.candidate) {
				// console.log('localPeerConnection candidate generated!');
				socket.emit('broadcast',{
					type:"remote:candidate",
					source:source,
					candidate:evt.candidate,
					id:id,
				});
			}
		}

		switch (source) {
			case 'camera':
				peerConnections[id].camera.addStream(localCamera);
				break;
			case 'screen':
				peerConnections[id].screen.addStream(localScreen);
				break;
		}


		peerConnections[id][source].setRemoteDescription(new RTCSessionDescription(remoteOffer),function(){
    		peerConnections[id][source].createAnswer(function(answer){
	    		console.log('set screen '+ source +' offer');
	    		peerConnections[id][source].setLocalDescription(new RTCSessionDescription(answer));
	    		socket.emit('broadcast',{
	    			type:'remote:offer',
	    			offer:answer,
	    			source:source,
	    			// config:config,
	    			id:id,
	    		})
	    	});
    	});
    	// document.getElementById('localScreen').src=URL.createObjectURL(localScreen);  	
	}

    var start=function(){
    	var q=$q.defer();
    	window.sharingScreen=true;

    	self.getScreen().then(function(screen){
    		console.log(screen);
    		self.getStream().then(function(audio){
    			console.log(audio);
    		})
    	})

    	return q.promise;
    }

    var stop=function(){
    	window.sharingScreen=false;
		for (var i in peerConnections) {
			if (peerConnections[i].screen) {
				peerConnections[i].screen.close();
				delete peerConnections[i].screen;
			}
			if (peerConnections[i].camera) {
				peerConnections[i].camera.close();
				delete peerConnections[i].camera;
			}
			delete peerConnections[i];
		}

		if (localCamera) {
			localCamera.stop();
			localCamera=undefined;
		}

		if (localScreen) {
			localScreen.stop();
			localScreen=undefined;
		}
	}

	socket.on('broadcast',function(data){
    	switch (data.type) {

    		// case 'broadcast:request':
    		// 	if (localCamera || localScreen) {
    		// 		// socket.emit('rtc',{
    		// 		// 	type:'broadcast:start'
    		// 		// })
    		// 		self.start(true,{},data.config);
    		// 	}
    		// 	else {
    		// 		socket.emit('rtc',{
    		// 			type:'broadcast:not:start'
    		// 		})
    		// 	}
    		// 	break;
    		case 'remote:candidate':
    			console.log('get remote ' + data.source +' candidate!')
    			if (peerConnections[data.id] && peerConnections[data.id][data.source]) {
    				peerConnections[data.id][data.source].addIceCandidate(new RTCIceCandidate(data.candidate));
    			}
    			break;

    		case 'remote:offer':
    			console.log('get remote '+ data.source +' offer!')
    			if (!peerConnections[data.id] || (peerConnections[data.id] && !peerConnections[data.id][data.source])) {
    				self.responseBroadcast(data.id,data.offer,data.source);
    			}
				// peerConnections[data.id].setRemoteDescription(new RTCSessionDescription(data.offer));
    			break;
    	}
    })

    self={
    	getScreen:getScreen,
		getStream: getStream,
		getAudio:getAudio,

		requestBroadcast:requestBroadcast,
		responseBroadcast:responseBroadcast,
		// getPeerConnection:function(){
		// 	return peerConnection;
		// },
		// getLocalStream:function(){
		// 	return localCamera;
		// },
		// getRemoteStream:function(){
		// 	return remoteStream;
		// },
		// getCallStatus:function(){
		// 	return inCall;
		// },
		start:start,
		stop:stop,
		
	};

	return self;
})
