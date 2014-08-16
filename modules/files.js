var exec = require('child-process-promise').exec;

exec('git ls-files')
.then(function(res){

	console.log(res.stdout);

});