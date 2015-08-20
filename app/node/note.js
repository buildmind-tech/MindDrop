var express = require('express');
var bodyParser = require('body-parser');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var app = express();

app.use(bodyParser.json());
app.post('/', function (req, res) {
	eventEmitter.emit('new:notes',req.body.html);
});

var server = app.listen(10087, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('MindDrop app listening at http://%s:%s', host, port);
});

var note=eventEmitter;

module.exports=note;