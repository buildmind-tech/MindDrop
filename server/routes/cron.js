var mongoose = require('mongoose');
var moment=require('moment');
var File = mongoose.model('File');
var fs=require('fs');

module.exports=function(){
	var CronJob = require('cron').CronJob;
	var job = new CronJob({
	  	cronTime: '00 00 * * * *',
	  	onTick: function() {
	    /*
	     * Runs every weekday (Monday through Friday)
	     * at 11:30:00 AM. It does not run on Saturday
	     * or Sunday.
	    */
		    var cutoff = moment().subtract(5, 'days')._d
			File.find({uploadTime:{$lt: cutoff}},function(err,files){
				console.log(files.length)
				for (var i=0;i < files.length;i++) {
					if (files[i].path) {
						fs.unlink(files[i].path, function (err) {
						  if (err) throw err;
						});
					}
				}
				File.find({uploadTime:{$lt: cutoff}}).remove().exec();
			})
	  	},
	  	start: true,
	});
	// job.start();
}