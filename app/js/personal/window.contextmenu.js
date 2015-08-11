angular.module('window.contextmenu',[])

.run(function($contextMenu){




	angular.element(document).find('body').bind('contextmenu',function(e){
		e.preventDefault();
  		$contextMenu.popup(e.x, e.y);
 		return false;
	})
})	

.factory('$contextMenu',function($db,$MindDrop,$auth,socket){
	var self=this;
	var clipboard = gui.Clipboard.get();
	var preferences = $db.getPreferences();
	var tray = new gui.Tray({ title: 'BuildMindDrop', icon: 'app/icon/icon.png' });

	var contextMenu;

	
	

	var constructRecentItems=function(){
		var db=$db.getRecentFileDb();

		var result=db.chain()
		.take(5)
  		.value()

  		return result;
	}

	var constructMenu=function(){

		if (contextMenu) {
			self.clean(contextMenu);
		}
		

		contextMenu = new gui.Menu();

		var uploadFileItem = new gui.MenuItem({
		  type: "normal", 
		  label: "上傳文件",
		  icon:"app/icon/context-menu/new.png"
		});

		uploadFileItem.click=function(){
			document.getElementById('fileDialog').click();
		}

		var uploadFolderItem = new gui.MenuItem({
		  type: "normal", 
		  label: "上傳文件夾",
		  icon:"app/icon/context-menu/zip.png"
		});

		uploadFolderItem.click=function(){
			document.getElementById('folderDialog').click();
		}

		

		var refreshPageItem = new gui.MenuItem({
		  type: "normal", 
		  label: "刷新",
		  icon:"app/icon/context-menu/refresh.png"
		});

		var exitAppItem = new gui.MenuItem({
		  type: "normal", 
		  label: "退出MindDrop",
		  key:"x",
		  icon:"app/icon/context-menu/quit.png"
		});

		var goToMindDropItem = new gui.MenuItem({
		  type: "normal", 
		  label: "前往MindDrop",
		  icon:"app/icon/context-menu/goto.png"
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




		refreshPageItem.click=function(){
			location.reload();
		}

		exitAppItem.click=function(){
			gui.App.quit();
		}

		contextMenu.append(uploadFileItem); 
		contextMenu.append(uploadFolderItem); 

		contextMenu.append(new gui.MenuItem({ type: 'separator' }));


		if (window.localStorage['loggedin']=='true') {
			var accountItem = new gui.MenuItem({
			  type: "normal", 
			  label: window.localStorage['usernickname'],
			  icon:"app/icon/context-menu/account.png"
			});

			accountItem.enabled=false;

			var logoutItem = new gui.MenuItem({
			  type: "normal", 
			  label: "註銷",
			  icon:"app/icon/context-menu/quit.png"
			});

			logoutItem.click = function(){
				$auth.logout().then(function(){
					socket.then(function(socket){
						socket.disconnect();
					})
				});
			}

			contextMenu.append(accountItem);
			contextMenu.append(logoutItem);
		}
		else {
			var showLoginPageItem = new gui.MenuItem({
			  type: "normal", 
			  label: "請登錄",
			  icon:"app/icon/context-menu/account.png"
			});

			showLoginPageItem.click=function(){
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

			contextMenu.append(showLoginPageItem);  // 0
		}

		contextMenu.append(new gui.MenuItem({ type: 'separator' })); // 3

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

				var item_icon;

				if (item.mime.indexOf('image')!=-1){
					item_icon="app/icon/context-menu/pure-text.png"
				}
				else if (item.mime.indexOf('octet-stream')!=-1){
					item_icon="app/icon/context-menu/zip.png"
				}
				else {
					item_icon="app/icon/context-menu/image.png"
				}

				var menuitem=new gui.MenuItem({
				  type: "normal", 
				  label: item.name,
				  icon:item_icon,
				});

				var submenu = new gui.Menu();

				var copyItem = new gui.MenuItem({
				  type: "normal", 
				  label: "拷貝到剪貼板",
				  icon:"app/icon/context-menu/copy.png"
				});

				copyItem.click=function(){
					clipboard.set('http://drop.buildmind.org/share/'+item.uuid, 'text');
				};

				var openInFolderItem = new gui.MenuItem({
				  type: "normal", 
				  label: "在文件夾中打開",
				  icon:"app/icon/context-menu/zip.png"
				});

				openInFolderItem.click=function(){
					gui.Shell.showItemInFolder(item.localPath);
				}

				var openInBrowserItem = new gui.MenuItem({
				  type: "normal", 
				  label: "在瀏覽器中打開",
				  icon:"app/icon/context-menu/open-in-browser.png"
				});

				openInBrowserItem.click=function(){
					gui.Shell.openExternal('http://drop.buildmind.org/share/'+item.uuid);
				}

				

				var deleteItem = new gui.MenuItem({
				  type: "normal", 
				  label: "刪除此記錄",
				  icon:"app/icon/context-menu/delete.png"
				});

				deleteItem.click=function(){
					($db.getRecentFileDb().remove({uuid:item.uuid}))
				}

				submenu.append(copyItem);
				submenu.append(openInFolderItem);
				submenu.append(openInBrowserItem);

				submenu.append(new gui.MenuItem({ type: 'separator' }));

				submenu.append(deleteItem);

				menuitem.submenu=submenu;

			
				contextMenu.append(menuitem);
			})

			if ($db.getRecentFileDb().value().length>5) {
				var moreFileItem=new gui.MenuItem({
				  type: "normal", 
				  label: "更多...",
				});

				moreFileItem.click=function(){

				}

				contextMenu.append(moreFileItem);

				var leftFileItem=new gui.MenuItem({
					type:"normal",
					label:"還有"+ ($db.getRecentFileDb().value().length-5) +"個文件"
				})

				leftFileItem.enabled=false;

				contextMenu.append(leftFileItem);
			}
		}

		contextMenu.append(new gui.MenuItem({ type: 'separator' })); // -4


		var goToScreenCrop = new gui.MenuItem({
		  type: "normal", 
		  label: "截取屏幕",
		  icon:"app/icon/context-menu/screenshot.png"
		});

		goToScreenCrop.click=function(){
			// console.log(screen)
			gui.Window.open('crop.html', {
			  position: 'center',
			  width: screen.width,
			  height: screen.height,
			  focus:true,
			  frame: false,
			  toolbar:false,
			  resizable:false,
			  transparent:true,
			  icon:"app/icon/icon.png",
			});
		}

		contextMenu.append(goToScreenCrop); // -1

		

		if (!window.sharingScreen) {
			var startScreenSharing = new gui.MenuItem({
			  type: "normal", 
			  label: "開始分享屏幕",
			  icon:"app/icon/context-menu/screenshare.png"
			});

			startScreenSharing.click=function(){
				$MindDrop.shareScreen();
				clipboard.set('http://drop.buildmind.org/share-screen/'+window.socket_id, 'text');
			}



			contextMenu.append(startScreenSharing);
		}
		else if (window.sharingScreen==true) {
			var selectScreenSharing = new gui.MenuItem({
			  type: "normal", 
			  label: "屏幕分享中",
			  icon:"app/icon/context-menu/screenshare.png"
			});


			var submenu = new gui.Menu();

			var copyLinkItem = new gui.MenuItem({
			  type: "normal", 
			  label: "拷貝觀看鏈接",
			  icon:"app/icon/context-menu/copy.png"
			});

			copyLinkItem.click=function(){
				clipboard.set('http://drop.buildmind.org/share-screen/'+window.socket_id, 'text');
			};

			var copyCodeItem = new gui.MenuItem({
			  type: "normal", 
			  label: "拷貝觀看代碼",
			  icon:"app/icon/context-menu/copy.png"
			});

			copyCodeItem.click=function(){
				clipboard.set(window.socket_id, 'text');
			};


			var stopItem = new gui.MenuItem({
			  type: "normal", 
			  label: "停止屏幕分享",
			});

			stopItem.click=function(){
				$MindDrop.stopScreenSharing();
			};

			submenu.append(copyLinkItem);
			submenu.append(copyCodeItem);
			submenu.append(stopItem);

			selectScreenSharing.submenu=submenu;


			contextMenu.append(selectScreenSharing);
		}


		contextMenu.append(new gui.MenuItem({ type: 'separator' })); // -2


		var uploadCompleteNotificationCheck = new gui.MenuItem({
		  	type: "checkbox", 
		  	label: "關閉上傳完成提示"
		});

		if (window.localStorage.uploadCompleteNotificationCheck && JSON.parse(window.localStorage.uploadCompleteNotificationCheck)==true) {
			uploadCompleteNotificationCheck.checked=true;
		}

		uploadCompleteNotificationCheck.click = function(){
			if (window.localStorage.uploadCompleteNotificationCheck && JSON.parse(window.localStorage.uploadCompleteNotificationCheck)==true) {
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

		if (window.localStorage.newPushCheck && JSON.parse(window.localStorage.newPushCheck)==true) {
			newPushCheck.checked=true;
		}

		newPushCheck.click = function(){
			if (window.localStorage.newPushCheck && JSON.parse(window.localStorage.newPushCheck)==true) {
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

	var clean=function(contextMenu){
		contextMenu.items.forEach(function(item){
			contextMenu.remove(item)
		})
	}

	// var getTray=function(){
	// 	return tray;
	// }
	// var menu=

	self={
		popup:popup,
		clean:clean,
		constructMenu:constructMenu,
		constructRecentItems:constructRecentItems,
	}

	return self;

})