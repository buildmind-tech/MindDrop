var express = require('express');
var router = express.Router();

require('./page')(router);
require('./data-transfer')(router);
require('./auth')(router);

// router.post('/new-share-room',function(req, res, next){

// })

module.exports = router;
