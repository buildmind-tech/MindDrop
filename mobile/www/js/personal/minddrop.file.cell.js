/**
* minddrop.file.cell Module
*
* Description
*/
angular.module('minddrop.file.cell', []).
directive('file', ['$rootScope','$compile', function($rootScope,$compile){
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

			container.append('<img style="max-width:100%;position:relative;left:50%;-webkit-transform:translate(-50%,0)" src="'+ item_icon +'">');
			container.append('<p style="text-align:center;margin:0;position:absolute;width:100%;bottom:0;left:0;">'+file.name+'</p>')
		}
	};
}]);