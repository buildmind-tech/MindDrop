/**
* minddrop.file.cell Module
*
* Description
*/
angular.module('minddrop.file.cell', []).
directive('file', ['$rootScope','$compile','$ionicPosition','$fileModal', function($rootScope,$compile,$ionicPosition,$fileModal){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		template:'<div></div>',
		replace:true,
		link: function(scope, element, attrs) {

			element.css('width','100%');
			// element.css('float','left');
			element.css('padding','5px');

			var container=$compile('<div style="background:white;overflow:hidden;width:100%;min-height:60px;padding:20px 0;position:relative;border-radius:10px;box-shadow: 0 5px 5px -3px rgba(0,0,0,.14),0 8px 10px 1px rgba(0,0,0,.098),0 3px 14px 2px rgba(0,0,0,.084);"></div>')(scope);

			element.append(container);

			var file=scope.file;
			var item_icon;
			if (file.mime.indexOf('image')!=-1){
				// item_icon="img/context-menu/image.png"
				item_icon="http://drop.buildmind.org/download/"+file.uuid
			}
			else if (file.mime.indexOf('octet-stream')!=-1){
				item_icon="img/context-menu/zip.png"
			}
			else if (file.mime.indexOf('text')!=-1){
				item_icon="img/context-menu/pure-text.png"
			}
			else {
				item_icon="img/ionic.png"
			}


			var thumbnailTpl='<img style="max-width:100%;position:relative;left:50%;-webkit-transform:translate(-50%,0)" drop-src="'+ item_icon +'">';
			var thumbnail=$compile(thumbnailTpl)(scope);

			thumbnail.bind('click',function(e){
				var offset=$ionicPosition.offset(thumbnail);
				$fileModal.show(item_icon,offset)
			})

			container.append(thumbnail);
			container.append('<p style="text-align:center;margin:0;position:absolute;width:100%;bottom:0;left:0;">'+file.name+'</p>')
		}
	};
}])

.factory('$fileModal', ['$rootScope','$compile','$ionicScrollDelegate','$timeout', function($rootScope,$compile,$ionicScrollDelegate,$timeout){
	var self=this;
	var view;

	var setView=function(_view){
		view=_view;
	}

	var show=function(icon,offset){
		if (view) {
			var img=view.find('img');
			img[0].src=icon;

			var section=view.find('section');

			var level=offset.width/window.innerWidth;
			var animate=false;
			var originLeft=(offset.left);
			var originTop=(offset.top+window.innerHeight/2-offset.top);

			var webkitTransform='scale('+ level +')'
			section.css('webkitTransform',webkitTransform);

			var centerX=offset.left+offset.width/2;
			var centerY=offset.top+offset.height/2;

			console.log('the centerX is '+centerX);
			console.log('the centerY is '+centerY);

			section.css('webkitTransformOrigin',(centerX/window.innerWidth)*100+'% '+(centerY/window.innerHeight)*100+'%')

			view.css('display','block')
			// $ionicScrollDelegate.$getByHandle('file-modal').zoomBy(1, true);
		}
		
	}

	var hide=function(){
		
		$timeout(function(){
			view.css('display','none')
		},500)
	}

	self={
		setView:setView,
		show:show,
		hide:hide
	}

	return self;
}])

.run(function($rootScope,$compile,$ionicScrollDelegate,$fileModal){
	


	



	// Debug
	var show=function(level,animate,originLeft,originTop){
		
	}

	window.show=show;

})

.directive('fileModal', ['$compile','$rootScope','$fileModal', function($compile,$rootScope,$fileModal){
	// Runs during compile

	var modalTpl='<div>'+
	'<div class="ion-close" style="position:absolute;top:20px;right:20px;color:white;z-index: 1;" ng-click="hide()"></div>'+
	'<ion-scroll min-zoom="0.2" delegate-handle="file-modal" zooming="true" direction="xy" style="width:100%; height:100%">'+
  	'<section style="width:100%;height:100%"><img style="width: 100%; max-height:100%;top:50%;position:relative;-webkit-transform:translate(0,-50%)" src="img/s-class-desktop.png"></section>'+
 	'</ion-scroll>'+
 	'</div>';

	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		template: modalTpl,
		// templateUrl: '',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope, element, attrs) {
			element.css('width',(window.innerWidth)+'px');
			element.css('height',(window.innerHeight)+'px');

			element.css('position','absolute');
			element.css('top','0');
			element.css('left','0');
			element.css('background','rgba(0,0,0,0.5)');
			element.css('z-index','100');

			element.css('display','none');


			$fileModal.setView(element);

			scope.hide=function(){
				$fileModal.hide();
			}
		}
	};
}]);