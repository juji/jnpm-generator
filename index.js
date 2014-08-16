#! /usr/bin/env node

if(process.argv.length==2 || process.argv[2]=='init'){

	require('./modules/init.js');

}else if(process.argv[2]=='save'){

	global.COMMITMSSG = (new Date()).toString();
	if(typeof process.argv[3] != 'undefined') global.COMMITMSSG = process.argv[3];
	require('./modules/save.js');


}else{

	console.log('');
	console.log('	 Usage');
	console.log('	 ==============================================');
	console.log('');
	console.log('	 jnpm');
	console.log('	 jnpm init');
	console.log('		 Will initialize git and dir structure');
	console.log('');
	console.log('	 jnpm save');
	console.log('	 jnpm save "commit message"');
	console.log('');
	console.log("		 Will add, commit, and push to 'origin'");
	console.log('');

}