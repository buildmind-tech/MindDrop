# Backend

The backend is supported by [ExpressJs](http://expressjs.com/) and [Nginx](http://nginx.org).

## A server supported share

Upload middleware is using [Multer](https://github.com/expressjs/multer), Download is directly piping the stream as response.

Server-side code is commited on Aug 14th. 

## A server-less share

All data are going through the [RTCDataChannel](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel). This method is at first priority when both client are online.
