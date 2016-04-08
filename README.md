# MindDrop [![Build Status](https://travis-ci.org/buildmind-tech/MindDrop.svg?branch=master)](https://travis-ci.org/buildmind-tech/MindDrop)
A Drop-And-Share Full Platform App (Web, Desktop & Mobile).

The Web Application is built in [AngularJS](https://angularjs.org/) together with amazingly [ngMaterial](https://material.angularjs.org).

The Desktop Application in the repo is built on top of [node-webkit](https://github.com/nwjs/nw.js). It is now being reconstructed by [electron](https://github.com/atom/electron) for cleaner modullization.

The Mobile Application is built with [ionic](http://ionicframework.com/) with wonderful [Apache Cordova](http://cordova.apache.org/) plugins.

![alt text](http://drop.buildmind.org/favicon.png "Mind-Drop")

# Docs
Docs are moving inside the folders for each platform.

[Mobile Docs](https://github.com/buildmind-tech/MindDrop/blob/master/mobile/mobile.doc.md)

[Desktop Docs](https://github.com/buildmind-tech/MindDrop/blob/master/app/desktop.doc.md)

[Web Docs]()

[Backend Docs](https://github.com/buildmind-tech/MindDrop/blob/master/server/server.doc.md)

# Build!
## For Desktop App

Clone to local and run 

    npm install
    
Then use nw binary to run the app.

## For Web App

Deploy the `web` folder to any servers of your own.

## For Mobile App

If you are familiar with [ionic](http://ionicframework.com/), simply use the 'mobile' folder just like your other ionic projects. 

Otherwise, you may want to check the [ionic start guide](http://ionicframework.com/getting-started/)

## For Server Deployment

In the server directory, run `npm install` and that will install all the dependencies you need.

The entry point of backend is in `bin/www`, so next you can use `node bin/www` or `forever bin/www` to get the server up.

# Why do we make this?

* UI Practice
* RTC Practice
* Get away from dropbox and GFW
* Fun and
* Because we can

# Thanks
* TonyChol
* [Yummy Yang](https://github.com/oopsyummy)

