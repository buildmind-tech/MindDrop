var mongoose = require('mongoose');

var UserSchema= new mongoose.Schema({
  username: String,
  userid:String,
  nickname:String,
  email:String,

  usersession:String,
  password:String,

  files:Array,

  freespace:{ type: Number , default: 2147483648 }

},{collection:'users'})

var FileSchema = new mongoose.Schema({
  name: String,
  mime: String,
  size: Number,
  uuid: String,
  uploadTime: { type: Date, default: Date.now },
  views: Number,
  path: String
},{collection:'files'});

var shareRoomSchema = new mongoose.Schema({
	room:String,
	broadcaster:String,
	listener:[String]
}); 

mongoose.model('File', FileSchema);
mongoose.model('User', UserSchema);
mongoose.model('shareRoom', shareRoomSchema);
