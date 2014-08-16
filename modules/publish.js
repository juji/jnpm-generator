var exec = require('shelljs').exec;
var test = require('shelljs').test;
var to = require('shelljs').to;
var path = require('path');
var inquirer = require("inquirer");
var q = require("q");

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
			message	: 'This will increment version patch number, perform jnpm push, '+
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
	
	if(exec( 'npm version patch' ).code){
		console.log('ERROR, npm version patch failed');	
		process.exit(1);	
	}

	console.log('Version NUmber is inceremented');

	require('./push.js');

	if(exec( 'npm publish' ).code) {
		console.log('ERROR, npm publish failed');	
		process.exit(1);	
	}

});