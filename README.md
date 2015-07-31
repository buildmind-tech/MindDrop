# MindDrop
A Drop-And-Share Desktop App

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

## 31/07/2015 - Constructed a frameless icon app and made it draggable

* We hacked the nw [-webkit-user-drag](https://github.com/nwjs/nw.js/wiki/Frameless-window) because it disables other html events such as dragover. Now everything that make the icon draggable is based on mousedown and mousemove detection.

# Thanks
* TonyChol

