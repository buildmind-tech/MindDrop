# MindDrop Mobile (Android/iOS)

This mobile application is built on top of ionic framework together with cordova plugins. 

Asides from previous projects we have built, MindDrop Mobile is going to deploy with crosswalk both in ios and android, which may significantly increase the performance of the app.

# Related plugins we used

## [cordova-file-transfer](https://github.com/apache/cordova-plugin-file-transfer)
Core modules for upload and download cache.

## [cordova-file-camera](https://github.com/apache/cordova-plugin-camera)
Plugin for taking photos or videos and getting the local path of them

## [cordova-splash-screen](https://github.com/apache/cordova-plugin-splashscreen)
Used at the start of the app, the same as what we use with ng-cloak, a pre-rendering protection for ionic projects.

## [cordova-status-bar](https://github.com/apache/cordova-plugin-statusbar)
Used when we are viewing the file in fullscreen to hide. We also style the status bar according to the background.

# UI
The User Interface takes much from [Droplr IOS](droplr.com/apps/iphone), however the performance of the newest version droplr isn't that good, we changed many minor parts.

# Basic Business Logic
App open --> Auth --> Get All File List --> Render
