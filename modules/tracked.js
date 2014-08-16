var exec = require('child-process-promise').exec;

exec('git ls-tree -r --full-tree HEAD')
.then(function(res){

	console.log(res.stdout);

});