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
	var preferences = $db.getPreferences();
	var tray = new gui.Tray({ title: 'BuildMindDrop', icon: 'app/icon/icon.png' });


	var showMainPageItem = new gui.MenuItem({
	  type: "normal", 
	  label: "顯示主頁面",
	});

	var refreshPageItem = new gui.MenuItem({
	  type: "normal", 
	  label: "刷新",
	});

	var exitAppItem = new gui.MenuItem({
	  type: "normal", 
	  label: "退出MindDrop",
	  key:"x"
	});

	var goToMindDropItem = new gui.MenuItem({
	  type: "normal", 
	  label: "前往MindDrop"
	});

	goToMindDropItem.click=function(){
		gui.Shell.openExternal('http://drop.buildmind.org');
	}

	var aboutItem = new gui.MenuItem({
	  	type: "normal", 
	  	label: "關於"
	});

	aboutItem.click=function(){
		gui.Window.open('about.html', {
		  position: 'center',
		  width: 450,
		  height: 350,
		  focus:true,
		  frame: false,
		  toolbar:false,
		  resizable:false,
		  transparent:true,
		  icon:"app/icon/icon.png",
		});
	}

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

				var submenu = new gui.Menu();

				var copyItem = new gui.MenuItem({
				  type: "normal", 
				  label: "拷貝到剪貼板",
				});

				copyItem.click=function(){
					clipboard.set('http://drop.buildmind.org/download/'+item.uuid, 'text');
				};

				var openInFolderItem = new gui.MenuItem({
				  type: "normal", 
				  label: "在文件夾中打開",
				});

				openInFolderItem.click=function(){
					gui.Shell.showItemInFolder(item.localPath);
				}

				var openInBrowserItem = new gui.MenuItem({
				  type: "normal", 
				  label: "在瀏覽器中打開",
				});

				openInBrowserItem.click=function(){
					gui.Shell.openExternal('http://www.buildmind.org/drop');
				}

				

				var deleteItem = new gui.MenuItem({
				  type: "normal", 
				  label: "刪除此記錄",
				});

				submenu.append(copyItem);
				submenu.append(openInFolderItem);
				submenu.append(openInBrowserItem);

				submenu.append(new gui.MenuItem({ type: 'separator' }));

				submenu.append(deleteItem);

				menuitem.submenu=submenu;

			
				contextMenu.append(menuitem);
			})
		}

		contextMenu.append(new gui.MenuItem({ type: 'separator' })); // -4


		var uploadCompleteNotificationCheck = new gui.MenuItem({
		  	type: "checkbox", 
		  	label: "關閉上傳完成提示"
		});

		if (JSON.parse(window.localStorage.uploadCompleteNotificationCheck)==true) {
			uploadCompleteNotificationCheck.checked=true;
		}

		uploadCompleteNotificationCheck.click = function(){
			if (JSON.parse(window.localStorage.uploadCompleteNotificationCheck)==true) {
				window.localStorage.uploadCompleteNotificationCheck=false;
			}
			else {
				window.localStorage.uploadCompleteNotificationCheck=true;
			}
		}

		var newPushCheck = new gui.MenuItem({
		  	type: "checkbox", 
		  	label: "關閉新通知提示"
		});

		if (JSON.parse(window.localStorage.newPushCheck)==true) {
			newPushCheck.checked=true;
		}

		newPushCheck.click = function(){
			if (JSON.parse(window.localStorage.newPushCheck)==true) {
				window.localStorage.newPushCheck=false;
			}
			else {
				window.localStorage.newPushCheck=true;
			}
		}

		contextMenu.append(uploadCompleteNotificationCheck); // -3
		contextMenu.append(newPushCheck); // -3


		contextMenu.append(new gui.MenuItem({ type: 'separator' })); // -4
		contextMenu.append(goToMindDropItem); // -3
		contextMenu.append(aboutItem); // -3

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