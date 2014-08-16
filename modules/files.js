var exec = require('shelljs').exec;

if(exec('git ls-files').code) {
	console.log('ERROR: Git ls-files failed');
};