var exec = require('shelljs').exec;
var test = require('shelljs').test;
var to = require('shelljs').to;
var path = require('path');
var inquirer = require("inquirer");
var q = require("inquirer");

var cdir = process.cwd();
var packFile = path.resolve(cdir+'/package.json');

if( !test('-f', packFile) ){
	console.log('ERROR: you should run npm init before doing this..');
	process.exit(1);
}

var pack = require( packFile );

if( !test( '-f',  path.resolve(cdir+'/'+pack.main ) ) ){

	console.log('ERROR: this directory has not been initalized');
	console.log(pack.main + ' doesn\'t exists.');
	process.exit(1);

}

(function(){

	var d = q.defer();

	inquirer.prompt( [

		{
			name: 'sure',
			message	: 'This will increment version number, perform jnpm push, '+
						'and publish your work to NPM. Are you sure?',
			type: 'confirm',
			'default': false
		}
	], function(ans){

		d.resolve(ans.sure);

	});

	return d.promise;
})()
.then(function(ok){


if(!ok) {
	console.log('You are not sure.. not doing anything..');
	process.exit();
}

var v = pack.version.split('.');
var last = (v.pop() * 1)+1;
pack.version = v.push(last).join('.');
if( JSON.stringify( pack, null, 2).to(packFile) ) {

	console.log('Version NUmber is inceremented');
	require('./push.js');
	if(exec( 'npm publish' ).code) {
		console.log('ERROR, npm publish failed');	
		process.exit(1);	
	}

}else{
	console.log('ERROR, try to do it manually');	
	process.exit(1);
}

});