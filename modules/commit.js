var exec = require('shelljs').exec;

if(exec('git add .').code) {
	console.log('ERROR: Git add failed');
	process.exit();
}

if( exec('git commit -a -m "'+global.COMMITMSSG.replace(/"/,'\"')+'"').code ){

	console.log('ERROR: Git commit failed');	
	process.exit();
}