var inquirer = require("inquirer");
var exec = require('child-process-promise').exec;
var fs = require('q-io/fs');
var q = require('q');
var nfs = require('fs');
var async = require('async-q');

var pack = require('./package.json');

(function(){

	var d = q.defer();

	inquirer.prompt( [

		{
			name: 'npmpack',
			message	: 'Select npm package to install:',
			type: 'checkbox',
			choices : [
				'express', 'grunt', 'bower', 
				new inquirer.Separator(),
				'async','q', 'q-io', 'async-q',
				new inquirer.Separator(),
				'mysql','redis','memcached', 'sqlite3', 'mongodb',
				new inquirer.Separator(),
				'mocha', 'chai', 'mocha-as-promise', 'chai-as-promise', 
				new inquirer.Separator(),
				'cheerio','underscore', 'lodash',
				new inquirer.Separator(), 
				'jade', 'dot', 'ejs', 'handlebars',
				new inquirer.Separator(), 
				'jhttp-client', 'simple-cookie',
				new inquirer.Separator(), 
				'mime', 'random-ua', 'encoding'
			]
		}

	], function(ans){

		q.resolve(ans.npmpack);

	});


	return q.promise;

})()
.then(function(installs){

	var functions = [];
	for(var i in installs){
		functions.push(function(c){
			console.log('Installing '+installs[i]);
			return exec('npm install '+installs[i]+' --save-dev');
		});
	}

	return async.series(functions);
})
.then(function(){

	console.log("Writing README.md");
	fs.write('README.md', "#"+pack.name+"\n\n"+pack.description+"\n\n##install\n```javascript\nnpm install "+pack.name+"\n```")

}).then(function(){

	console.log('creating your main script');
	var s = pack.main.replace(/\\/,'/');
	if(!(/\//.test(pack.main))) return fs.write(pack.main,'//create by jnpm-generator');
	s = s.split('/');
	var f = '';
	for(var i in s){
		f += s[i];
		if(!(/\.js$/.test(f)) && !nfs.existsSync(f)) nfs.mkdirSync(f);
		else if(/\.js$/.test(f) && !nfs.existsSync(f)) return fs.write(f,'//create by jnpm-generator');
		else return true;
		f += '/';
	}
})
.then(function(){

	if( pack.repository.type == 'git' ){

		console.log('Creating initial git repo');
		return exec('git init')
		.then(function(){
			console.log("Adding remote git as 'origin'");
			return exec('git remote add origin '+pack.repository.url);
		})
		.then(function(){
			console.log("Writing .gitignore");
			return fs.write('.gitignore', 'node_modules/*');
		})
		.then(function(){
			console.log("Run inital commit");
			return exec('git add -A ./* && git commit -a -m "initial"');
		}).then(function(){
			console.log("Run inital push to 'origin'");
			return exec('git push origin master');
		}).then(function(){
			console.log('DONE!');
		});

	}else{
		console.log('Repo is not git. not doing anything..');
		console.log('DONE!');

		return true;
	}

}).fail(function(e){

	console.log('ERROR');
	console.log(e);

});
