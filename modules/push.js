var exec = require('shelljs').exec;

require('./commit.js');

if(exec('git push').code) {
	console.log('ERROR: Git push failed');
	process.exit();
}