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

## 01/08/2015 - Backend, drop to upload

* The Backend is ready for both upload and download together with database indexing of all files. All files are currently tracing by its unique uuid and available for everyone
* The app is ready for drop to upload, and upload records are saved locally on client machines (no cloud backup) .


## 03/08/2015 - Recent upload and clipboard

* Right click on the float menu will pop up a context menu contains the recent file list.
* Click on the recent file in the context menu will programatically copy to your clipboard and you can paste them anywhere else.

# Thanks
* TonyChol

