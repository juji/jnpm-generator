var inquirer = require("inquirer");
var q = require('q');
var path = require('path');

var exec = require('shelljs').exec;
var to = require('shelljs').to;
var toEnd = require('shelljs').toEnd;
var test = require('shelljs').test;
var mkdir = require('shelljs').mkdir;

var cdir = process.cwd();
var packFile = path.resolve(cdir+'/package.json');
var userans = {};

if( !test('-f', packFile) ){

	console.log('ERROR: you should run npm init before doing this..');
	process.exit(1);
}	

var pack = require( packFile );

if( test( '-f',  path.resolve(cdir+'/'+pack.main ) ) ){

	console.log('ERROR: this directory may already be initalized');
	console.log(pack.main + ' already exists.');
	process.exit();

}

(function(){

	var d = q.defer();

	inquirer.prompt( [

		{
			name: 'npmpack',
			message	: 'Select npm package(s) to install:',
			type: 'checkbox',
			choices : [
				'mocha', 'chai', 'mocha-as-promised', 'chai-as-promised', 
				'express', 'grunt', 'bower', 'shelljs',
				'async','q', 'q-io', 'async-q', 'child-process-promise',
				'redis','memcached', 'sqlite3', 'mongodb',
				'cheerio','underscore', 'lodash',
				'jade', 'dot', 'ejs', 'handlebars',
				'jhttp-client', 'simple-cookie',
				'mime', 'random-ua', 'encoding'
			],
			'default':['mocha','chai','chai-as-promised','q', 'q-io']
		},
		{
			type: 'confirm',
			name:'cli',
			message: 'Is this cli program?',
			'default': true
		},
		{
			type: 'input',
			name: 'cliName',
			message:'cli command name?',
			'default': pack.name,
			when:function(ans){
				return ans.cli;
			}
		},
		{
			type: 'input',
			name: 'cliScript',
			message:'cli script name?',
			'default': pack.main,
			when:function(ans){
				return ans.cli;
			}
		},
		{
			type: 'confirm',
			name : 'testscipt',
			message: 'Shoul I create empty test script?',
			'default': true,
			when:function(ans){
				return ans.npmpack.indexOf('mocha') > -1;
			}
		}

	], function(ans){

		userans = ans;
		d.resolve(ans.npmpack);

	});


	return d.promise;

})()
.then(function(installs){

	var functions = [];
	for(var i in installs){
		(function(){
			var num = i;
			var t = ['mocha', 'chai', 'mocha-as-promised', 'chai-as-promised'];
			if(t.indexOf(installs[num]) < 0){
				exec('npm install '+installs[num]+' --save');
			}else{
				exec('npm install '+installs[num]+' --save-dev');
			}
			
		})();
	}

	return true;

})
.then(function(){

	console.log("Writing README.md");
	console.log(' ');
	return ("#"+pack.name+"\n\n"+pack.description+
			"\n\n##install\n```javascript\nnpm install "+
			pack.name+"\n```").to('README.md');

}).then(function(){

	console.log('creating your main script');
	console.log(' ');
	var s = pack.main.replace(/\\/,'/');

	if(!(/\//.test(pack.main))) {
		'//created by jnpm-generator'.to(pack.main);
		
	}else{

		mkdir('-p', pack.main.split('/').pop().join('/'));
		'//created by jnpm-generator'.to(pack.main);

	}

	return true;

})
.then(function(){

	if(!userans.testcript) return true;

	console.log('creating empty test script');
	console.log(' ');

	mkdir('test');
	'//test script'.to('test/tests.js');
	
	return true;

})
.then(function(){

	if(!userans.cli) return true;

	pack.bin = {};
	pack.bin[ userans.cliName ] = userans.cliScript;
	
	console.log('preparing environment for cli command');
	console.log(' ');

	JSON.stringify( pack ).to( packFile );

	if(
		(test('-f', userans.cliScript) && userans.cliScript == pack.main) || 
		!test('-f', userans.cliScript)) {
		'#!/usr/bin/env/ node'.to(userans.cliScript);
	}else{

		console.log(userans.cliScript + ' already Exists. don\'t forget to add the hashbang:');
		console.log('#!/usr/bin/env/ node');
		console.log(' ');

	}

	return true;

}).then(function(){

	if( pack.repository.type != 'git' ){
		console.log('Repo is not git. not doing anything..');
		console.log('DONE!');

		return true;
	}
		
	console.log('setting-up git');
	console.log(' ');

	//initialize
	if(!test('-d',cdir+'/.git')){
		exec('git init');
	}

	//add remote
	var repo = exec('git remote show',{silent:true}).output;
	if(!(/origin/m.test(repo))) exec('git remote add origin '+pack.repository.url);

	//add .gitignore
	'node_modules/*\nterminal.glue'.to('.gitignore');
	
	exec('git rm -r ./node_modules/* --cached --ignore-unmatch');
	exec('git rm -r ./terminal.glue --cached --ignore-unmatch');


	//add, commit and push
	console.log("Run inital commit and push");
	console.log(' ');
	exec('git add .');
	exec('git commit -am "initial"');
	if( exec('git push').code ){
		exec('git pull');
		exec('git push');
	};

	console.log(' ');
	console.log('DONE!');

}).fail(function(e){

	console.log('ERROR');
	console.log(e);

});
