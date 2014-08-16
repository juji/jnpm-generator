var exec = require('child-process-promise').exec;

exec('git add .').then(function(res){
	return exec('git -a -m "'+global.COMMITMSSG.replace(/"/,'\"')+'"'); 
}).then(function(res){
	console.log(res.stdout);
});