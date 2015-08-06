# MindDrop [![Build Status](https://travis-ci.org/buildmind-tech/MindDrop.svg?branch=master)](https://travis-ci.org/buildmind-tech/MindDrop)
A Drop-And-Share Desktop App built on top of [node-webkit](https://github.com/nwjs/nw.js).

![alt text](http://drop.buildmind.org/images/favicon.png "Mind-Drop")

# Build!
Clone to local and run 

    npm install
    
Then use nw binary to run the app

# Backend

The backend is supported by [ExpressJs](http://expressjs.com/) and [Nginx](http://nginx.org).

## A server supported share

Upload middleware is using [Multer](https://github.com/expressjs/multer), Download is directly piping the stream as response.

## A server-less share

All data are going through the [RTCDataChannel](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel). This method is at first priority when both client are online.

# Frontend

The frontend is built in [AngularJS](https://angularjs.org/).

# Why do we make this?

* UI Practice
* RTC Practice
* Get away from dropbox and GFW
* Fun and
* Because we can

# Development

Please refer to [Development](https://github.com/buildmind-tech/MindDrop/wiki/Development-Handbook) Wiki Page.

# Releases

## 2015/08/06 -  v0.1.0

This product is in alpha phase, an alpha [release](https://github.com/buildmind-tech/MindDrop/releases/tag/v0.1.0-alpha).

Debug mode is on and devtools are opened at opening, source code are not zipped.

# Thanks
* TonyChol

