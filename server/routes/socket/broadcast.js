var mongoose = require('mongoose');

module.exports=function(io){

io.on('connection',function(socket){
	console.log('new connecting id '+socket.id)

	socket.on('broadcast',function(data){
		if (data.id) {
			var id=data.id;
			data.id=socket.id;
			io.to(id).emit('broadcast',data);
		}
	})
})

}