angular.module('window.drag',[])
.run(function(){
	var mousedown=false;
	var mousecoor=[0,0];

	angular.element(document).find('section').bind('mousedown',function(e){
		mousedown=true;
		mousecoor=[e.screenX, e.screenY];
	})
	angular.element(document).find('section').bind('mousemove',function(e){
		if (mousedown) {
			win.moveBy(e.screenX-mousecoor[0], e.screenY-mousecoor[1])
			mousecoor=[e.screenX,e.screenY];
		}
	})
	angular.element(document).find('section').bind('mouseup',function(e){
		mousedown=false;
		win.moveTo(e.screenX-e.pageX, e.screenY-e.pageY)
	})

	angular.element(document).find('section').bind('mouseleave',function(e){
		mousedown=false;
		// win.moveTo(e.screenX-e.pageX, e.screenY-e.pageY)
	})
})