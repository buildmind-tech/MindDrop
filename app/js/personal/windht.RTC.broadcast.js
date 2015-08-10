angular.module('windht.RTC.broadcast',[])



.factory('$broadcast', function ($q,socket,$rootScope) {
	var self=this;

	window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
	window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
	window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
	window.URL = window.URL || window.mozURL || window.webkitURL;
	window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;

	// For broadcast
	var localCamera,localScreen;
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

		navigator.getUserMedia({audio: false, video: {
			mandatory: {
		        chromeMediaSource: 'desktop', 
		        chromeMediaSourceId: 'screen:0', 
		        maxWidth: 1920, 
		        maxHeight: 1080
		    }, 
		    optional:[]
		}}, function (stream) {
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
		}, function(err){console.log(err)}, 
		{
			offerToReceiveAudio: true,
			offerToReceiveVideo: true
		});
	}

	var responseBroadcast=function(id,remoteOffer){
		peerConnections[id] = new RTCPeerConnection(iceConfig);

		peerConnections[id].oniceconnectionstatechange = function(ev) { 
			console.log(ev);
		    if(peerConnections[id].iceConnectionState == 'disconnected') {
		    	console.log('some one disconnected!')
		        peerConnections[id].close();
		        delete peerConnections[id];
		    }
		};

		peerConnections[id].onicecandidate=function(evt){
			// console.log(evt);
			if (evt.candidate) {
				console.log('localPeerConnection candidate generated!');
				socket.emit('broadcast',{
					type:"remote:candidate",
					candidate:evt.candidate,
					// config:config,
					id:id,
				});
			}
		}
		peerConnections[id].onaddstream=function(evt){
			console.log('get remote stream');
			// document.getElementById('localVideo').src=URL.createObjectURL(evt.stream);

			// document.getElementById('localVideo').src=URL.createObjectURL(evt.stream);
		}

		// window.localScreen=localScreen;
		// peerConnections[id].addStream(localScreen);

		peerConnections[id].addStream(localScreen);

		peerConnections[id].setRemoteDescription(new RTCSessionDescription(remoteOffer),function(){
    		peerConnections[id].createAnswer(function(answer){
	    		console.log('set local offer');
	    		peerConnections[id].setLocalDescription(new RTCSessionDescription(answer));
	    		socket.emit('broadcast',{
	    			type:'remote:offer',
	    			offer:answer,
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
    	})

    	return q.promise;
    }

    var stop=function(){
    	window.sharingScreen=false;
		for (var i in peerConnections) {
			peerConnections[i].close();
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
    			console.log('get remote candidate!')
    			if (peerConnections[data.id]) {
    				peerConnections[data.id].addIceCandidate(new RTCIceCandidate(data.candidate));
    			}
    			break;

    		case 'remote:offer':
    			console.log('get remote offer!')
    			if (!peerConnections[data.id]) {
    				self.responseBroadcast(data.id,data.offer);
    			}
				// peerConnections[data.id].setRemoteDescription(new RTCSessionDescription(data.offer));
    			break;
    	}
    })

    self={
    	getScreen:getScreen,
		getStream: getStream,

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
