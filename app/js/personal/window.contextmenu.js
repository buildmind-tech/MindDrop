angular.module('window.contextmenu',[])

.run(function($contextMenu){


	

	angular.element(document).find('body').bind('contextmenu',function(e){
		e.preventDefault();
  		$contextMenu.popup(e.x, e.y);
 		return false;
	})
})
	

.factory('$contextMenu',function($db){
	var self=this;
	var clipboard = gui.Clipboard.get();
	var tray = new gui.Tray({ title: 'BuildMindDrop', icon: 'app/icon/icon.png' });


	showMainPageItem = new gui.MenuItem({
	  type: "normal", 
	  label: "顯示主頁面",
	});

	refreshPageItem = new gui.MenuItem({
	  type: "normal", 
	  label: "刷新",
	});

	exitAppItem= new gui.MenuItem({
	  type: "normal", 
	  label: "退出MindDrop",
	  key:"x"
	});

	showMainPageItem.click=function(){
		gui.Window.open('auth/index.html', {
		  position: 'center',
		  width: 300,
		  height: 500,
		  focus:true,
		  frame: false,
		  toolbar:false,
		  resizable:false,
		});
	}

	refreshPageItem.click=function(){
		location.reload();
	}

	exitAppItem.click=function(){
		gui.App.quit();
	}

	var constructRecentItems=function(){
		var db=$db.getRecentFileDb();

		var result=db.chain()
		.take(5)
  		.value()

  		return result;
	}

	var constructMenu=function(){

		var contextMenu = new gui.Menu();

		// console.log(contextMenu.items);
		// console.log(contextMenu.items.length)

		contextMenu.append(showMainPageItem);  // 0
		contextMenu.append(refreshPageItem);   // 1

		contextMenu.append(new gui.MenuItem({ type: 'separator' })); // 3

		var recentItems=self.constructRecentItems();

		if (!recentItems || recentItems.length==0) {

			var noRecentList=new gui.MenuItem({
			  type: "normal", 
			  label: "沒有最近的上傳文件",
			})

			noRecentList.enabled=false;

			contextMenu.append(noRecentList);
		}
		else {
			recentItems.forEach(function(item){
				var menuitem=new gui.MenuItem({
				  type: "normal", 
				  label: item.name,
				});
				menuitem.click=function(){
					clipboard.set('http://drop.buildmind.org/download/'+item.uuid, 'text');
				};
				contextMenu.append(menuitem);
			})
		}

		contextMenu.append(new gui.MenuItem({ type: 'separator' })); // -2
		contextMenu.append(exitAppItem); // -1

		// Set tray
		tray.menu=contextMenu;

		return contextMenu;
	}

	var popup=function(x,y){
		var contextMenu=self.constructMenu();
		contextMenu.popup(x,y);
	}

	// var getTray=function(){
	// 	return tray;
	// }
	// var menu=

	self={
		popup:popup,
		constructMenu:constructMenu,
		constructRecentItems:constructRecentItems,
	}

	
	

	return self;

})