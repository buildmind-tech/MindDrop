# MindDrop [![Build Status](https://travis-ci.org/buildmind-tech/MindDrop.svg?branch=master)](https://travis-ci.org/buildmind-tech/MindDrop)
A Drop-And-Share Desktop App built on top of [node-webkit](https://github.com/nwjs/nw.js).

![alt text](http://drop.buildmind.org/images/favicon.png "Mind-Drop")

# Features

![alt text](http://drop.buildmind.org/images/sample.png "Mind-Drop")

## Drag-n-drop, then share your links.

All files drag in MindDrop are uploaded to MindDrop server, with the share link everyone can access the file.

## Convenient screen crop

You can directly crop a part of screen and share the image.

## Screen Sharing (also add camera support)

You can start screen sharing anytime you like and people who uses chrome or firefox can directly watch it in their browsers through the links.

## Simple Note Sending (Rich Text)

You can directly send simple messages through our text editor to your local network users or registered user. In reduction to IM, this function will always stays at its own position.

# Build!
Clone to local and run 

    npm install
    
Then use nw binary to run the app

# Backend

The backend is supported by [ExpressJs](http://expressjs.com/) and [Nginx](http://nginx.org).

## A server supported share

Upload middleware is using [Multer](https://github.com/expressjs/multer), Download is directly piping the stream as response.

Server-side code is commited on Aug 14th. 

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

## 2015/08/12 -  v0.2.0

This is a beta [release](https://github.com/buildmind-tech/MindDrop/releases/tag/v0.2.0-beta), the front-end is currently working great with the backend.

Mac versions are not provided, feel free to download the raw package and directly run with nw instead of clone and build yourself.

## 2015/08/06 -  v0.1.0

This product is in alpha phase, an alpha [release](https://github.com/buildmind-tech/MindDrop/releases/tag/v0.1.0-alpha).

Debug mode is on and devtools are opened at opening, source code are not zipped.

# Thanks
* TonyChol

