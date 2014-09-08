var inquirer = require("inquirer");
var q = require('q');
var path = require('path');

var exec = require('shelljs').exec;
var to = require('shelljs').to;
var toEnd = require('shelljs').toEnd;
var test = require('shelljs').test;
var mkdir = require('shelljs').mkdir;

var chalk = require('chalk');

var cdir = process.cwd();
var packFile = path.resolve(cdir+'/package.json');
var userans = {};

var log = {
	error : function(str){
		console.log( chalk.bgRed.black(' ERROR: '+str+' ') );
	},
	progress: function(str){
		console.log( chalk.bgBlue.white(' '+str+' ') );
	},
	note: function(str){
		console.log( chalk.bgWhite.black(' NOTE: '+str+' ') );
	},
	warn: function(str){
		console.log( chalk.bgYellow.black(' WARN: '+str+' ') );
	},
	ok: function(str){
		console.log( chalk.bgGreen.black(' '+str+' ') );
	}
};

if( !test('-f', packFile) ){
	log.error('you should run npm init before doing this..');
	process.exit(1);
}	

var pack = require( packFile );

if( test( '-f',  path.resolve(cdir+'/'+pack.main ) ) ){

	log.error(pack.main + ' already exists.');
	log.error('this directory may already been initalized');
	process.exit(1);

}

//initialize with git lookup
if( 
	typeof pack.repository != 'undefined' &&
	typeof pack.repository.type != 'undefined' &&
	pack.repository.type == 'git'
 ){

	//initialize
	if(!test('-d',cdir+'/.git')){
		log.progress('initializing git repo..');
		exec('git init');
	}

	//add remote
	var repo = exec('git remote show',{silent:true}).output;
	if(!(/origin/m.test(repo))) {
		log.progress("adding "+pack.repository.url+" as 'origin'");
		exec('git remote add origin '+pack.repository.url);
	}else{
		log.note("The 'origin' remote has been set. will not add remote url");
	}

	log.progress('checking remote repo..');
	var remote = exec('git ls-remote').output.split("\n");
	remote.shift();	
	if(remote.length && remote[0]){

		log.error('Your remote is not empty. You should do this manually..');
		process.exit(1);

	}

}else{

	log.warn('Your repo is not a git. This thing works with git..');

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
				'grunt', 'bower', 'shelljs', 'chalk', 'commander', 'node-getopt',
				'async','q', 'q-io', 'async-q', 
				'express', 'redis','memcached', 'sqlite3', 'mongodb', 'mysql',
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

	log.progress('Installing NPM modules..');
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

	log.progress("Writing README.md..");
	var desc = typeof pack.description != 'undefined' ? pack.description : '';
	return ("#"+pack.name+"\n\n"+desc+
			"\n\n##install\n```javascript\nnpm install "+
			pack.name+"\n```").to('README.md');

}).then(function(){

	log.progress('creating your main script..');
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

	log.progress('creating empty test script');

	mkdir('test');
	'//test script'.to('test/tests.js');
	
	return true;

})
.then(function(){

	if(!userans.cli) return true;

	delete require.cache[packFile];
	pack = require( packFile );
	pack.bin = {};
	pack.bin[ userans.cliName ] = userans.cliScript;
	
	log.progress('preparing package.json for cli..');

	JSON.stringify( pack, null, 2 ).to( packFile );

	if(
		(test('-f', userans.cliScript) && userans.cliScript == pack.main) || 
		!test('-f', userans.cliScript)) {
		"#!/usr/bin/env/ node\n\n".to(userans.cliScript);
	}else{
		console.log('');
		log.note(userans.cliScript + ' already Exists. will not do anything to the file.');
		log.note('Don\'t forget to add the hashbang: #!/usr/bin/env/ node');
		console.log('');
	}

	return true;

}).then(function(){

	if( 
		typeof pack.repository == 'undefined' || 
		typeof pack.repository.type == 'undefined' || 
		pack.repository.type != 'git'
	){
		log.note('Repo is not git. not doing anything..');
		log.ok('i\'m done..');
		return true;
	}
		
	log.progress('setting-up local repo..');

	//add .gitignore
	'node_modules/*\nterminal.glue'.to('.gitignore');
	
	exec('git rm -r ./node_modules/* --cached --ignore-unmatch');
	exec('git rm -r ./terminal.glue --cached --ignore-unmatch');


	//add, commit and push
	log.progress("Run inital commit and push");
	exec('git add .');
	exec('git commit -am "initial"');
	if( exec('git push origin master').code ){
		log.progress('OK, pulling from remote repo..');
		if( !exec('git pull origin master').code ){
			exec('git push origin master');
		}else{
			log.error('Looks like the pulled data can not be merged..');
			log.note('You have to resolve this manually');
		};
	};

	log.ok('i\'m done..');

}).fail(function(e){

	log.error('ERROR');
	console.log(e);

});
