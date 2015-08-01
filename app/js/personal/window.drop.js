angular.module('window.drop',[])
.run(function($MindDrop){

	window.ondragover = function(e) { e.preventDefault(); return false };
	window.ondrop = function(e) { e.preventDefault(); return false };

	angular.element(document).find('section').bind('drop',function(e){
		e.preventDefault();
		
		$MindDrop.upload(e.dataTransfer.files);

		return false;
	})
})