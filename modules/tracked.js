var exec = require('shelljs').exec;

if( exec('git ls-tree -r --full-tree HEAD').code ){
	console.log('ERROR: git ls-tree failed');
}