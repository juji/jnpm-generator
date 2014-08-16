#!/usr/bin/env node

function printHelp(){
	console.log('');
	console.log('	 jnpm Usage');
	console.log('	 ==============================================');
	console.log('');
	console.log('	 jnpm');
	console.log('	 jnpm init');
	console.log('		 Will initialize git and dir structure');
	console.log('');
	console.log('	 jnpm commit');
	console.log('	 	 Will add and commit git');
	console.log('');
	console.log('	 jnpm push');
	console.log('	 jnpm push "commit message"');
	console.log('');
	console.log("		 Will add, commit, and push to 'origin'");
	console.log('');
	console.log('	 jnpm tracked');
	console.log("		 Will list all tracked files");
	console.log('');
	console.log('	 jnpm files');
	console.log("		 Will list all files");
	console.log('');
	console.log('	 jnpm help');
	console.log("		 Print this help content");
	console.log('');
	process.exit();
}

var shell = require('shelljs');

if(!shell.which('git')){
	console.log('jnpm requires git');
	process.exit();
}

if(!shell.which('npm')){
	console.log('jnpm requires npm');
	process.exit();
}

if(process.argv.length==2 || process.argv[2]=='init'){

	require('./modules/init.js');

}else if(process.argv[2]=='commit'){

	global.COMMITMSSG = "auto-commit";
	if(typeof process.argv[3] != 'undefined') global.COMMITMSSG = process.argv[3];
	require('./modules/commit.js');

}else if(process.argv[2]=='push'){

	global.COMMITMSSG = "auto-commit";
	if(typeof process.argv[3] != 'undefined') global.COMMITMSSG = process.argv[3];
	require('./modules/push.js');

}else if(process.argv[2]=='tracked'){

	require('./modules/tracked.js');

}else if(process.argv[2]=='files'){

	require('./modules/files.js');

}else if(process.argv[2]=='help'){

	printHelp();

}else{

	printHelp();

}