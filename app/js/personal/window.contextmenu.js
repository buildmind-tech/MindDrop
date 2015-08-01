angular.module('window.contextmenu',[])

.run(function($contextMenu){
	angular.element(document).find('body').bind('contextmenu',function(e){
		e.preventDefault();
  		$contextMenu.popup(e.x, e.y);
 		return false;
	})
})
	

.factory('$contextMenu',function(){
	var self=this;
	var contextMenu = new gui.Menu();

	showMainPageItem = new gui.MenuItem({
	  type: "normal", 
	  label: "顯示主頁面",
	});

	exitAppItem= new gui.MenuItem({
	  type: "normal", 
	  label: "退出MindDrop",
	  key:"x"
	});

	exitAppItem.click=function(){
		gui.App.quit();
	}

	contextMenu.append(showMainPageItem);
	// contextMenu.append(new gui.MenuItem({ label: 'Item B' }));
	contextMenu.append(new gui.MenuItem({ type: 'separator' }));
	contextMenu.append(exitAppItem);

	var popup=function(x,y){
		contextMenu.popup(x,y)
	}

	var clean=function(){
		contextMenu.items.forEach(function(item){
			contextMenu.remove(item);
		})
	}

	self={
		popup:popup
	}

	return self;

})