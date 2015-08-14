var mongoose = require('mongoose');
var File = mongoose.model('File');

module.exports=function(router){

	router.get('/', function(req, res) {
	  res.render('index', { title: 'Express' });
	});
	
	router.get('/share/:id',function(req, res, next){
		var id=req.params.id;
		if (id) {	
			File.findOne({uuid:id},function(err,file){
				if (file) {
					res.render('share', {title: "Share-"+file.name,name:file.name,size:file.size,uuid:file.uuid});
				}
				else {
					// res.render('share-not-found', {title: "File is expired"});
					res.redirect('/share-not-found');
				}
			})
		}
		else {
			res.redirect('/share-not-found');
		}

	})

	router.get('/share-screen/:id',function(req, res, next){
		var id=req.params.id;
		// if (id && io.sockets.sockets[id]) {	
		// 	res.render('share-screen',{id:id})
		// }
		// else {
		// 	res.redirect('/share-screen-not-found');
		// }

		res.render('share-screen',{id:id})
	})
}