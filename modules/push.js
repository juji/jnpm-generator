var exec = require('child-process-promise').exec;

	exec('git add .')

.then(function(res){

	console.log(res.stdout);
	return exec('git -a -m "'+global.COMMITMSSG.replace(/"/,'\"')+'"'); })

.then(function(res){

	console.log(res.stdout);
	return exec('git push'); 

}).then(function(res){
	console.log(res.stdout);
});