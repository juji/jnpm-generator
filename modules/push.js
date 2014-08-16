var exec = require('shelljs').exec;

require('./commit.js');

if(exec('git push origin master').code) {
	console.log('ERROR: Git push failed');
	process.exit();
}