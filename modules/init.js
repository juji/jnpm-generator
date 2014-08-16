var inquirer = require("inquirer");
var exec = require('child-process-promise').exec;
var fs = require('q-io/fs');
var q = require('q');
var nfs = require('fs');
var async = require('async-q');


if(!nfs.existsSync('./package.json')){
	console.log('ERROR: you should run npm init before doing this..');
	process.exit(1);
}	

var cdir = process.cwd();
var pack = require(cdir+'/package.json');

(function(){

	var d = q.defer();

	console.log('NOTE: you should run npm init before doing this..')

	inquirer.prompt( [

		{
			name: 'npmpack',
			message	: 'Select npm package(s) to install:',
			type: 'checkbox',
			choices : [
				'mocha', 'chai', 'mocha-as-promised', 'chai-as-promised', 
				'express', 'grunt', 'bower', 
				'async','q', 'q-io', 'async-q', 'child-process-promise',
				'redis','memcached', 'sqlite3', 'mongodb',
				'cheerio','underscore', 'lodash',
				'jade', 'dot', 'ejs', 'handlebars',
				'jhttp-client', 'simple-cookie',
				'mime', 'random-ua', 'encoding'
			]
		}

	], function(ans){

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
				functions.push(function(c){
					console.log('npm install '+installs[num]+' --save');
					return exec('npm install '+installs[num]+' --save');
				});		
			}else{
				functions.push(function(c){
					console.log('npm install '+installs[num]+' --save-dev');
					return exec('npm install '+installs[num]+' --save-dev');
				});		
			}
			
		})();
	}

	return async.series(functions);
})
.then(function(){

	console.log("Writing README.md");
	return fs.write('README.md', "#"+pack.name+"\n\n"+pack.description+"\n\n##install\n```javascript\nnpm install "+pack.name+"\n```");

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
	};

}).then(function(){

	console.log('creating empty test script');
	return fs.makeDirectory('test')
	.then(function(){
		return fs.write('test/tests.js','//test script');
	});

}).then(function(){

	if( pack.repository.type == 'git' ){
		
		console.log('setting-up git');

		return fs.exists(cdir+'/.git')
		.then(function(exists){
			if(exists) return true;
			console.log('Creating initial git repo');
			return exec('git init')
			.then(function(res){
				console.log(res.stdout);
				return true;
			});
		})
		.then(function(res){
			return exec('git remote show')
			.then(function(res){
				if(/origin/m.test(res.stdout)) return true;
				return false;
			});
		})
		.then(function(origin){
			if(origin) return true;
			console.log("Adding remote git as 'origin'");
			return exec('git remote add origin '+pack.repository.url)
			.then(function(res){
				console.log(res.stdout);
				return true;
			});
		})
		.then(function(res){
			return fs.exists('.gitignore')
			.then(function(exists){
				console.log("Writing .gitignore");
				if(!exists) {
					return fs.write('.gitignore','node_modules/*\nterminal.glue')
					.then(function(){
						return exec('git rm -r ./node_modules/* --cached --ignore-unmatch');
					})
					.then(function(){
						return exec('git rm -r ./terminal.glue --cached --ignore-unmatch');
					});
				}
				return true;
			})
		})
		.then(function(res){
			console.log("Run inital commit");
			return exec('git add .')
			.then(function(){
				return exec('git commit -a -m "initial"');
			})
			.fail(function(){
				return exec('git commit -a -m "initial"');
			});
		}).then(function(res){
			console.log(res.stdout);
			console.log("Run inital push to 'origin'");
			return exec('git push origin master')
			.fail(function(res){
				console.log("ERROR. Maybe, should run pull first..");
				console.log("Pulling from 'origin'");
				return exec('git pull origin master');
			})
			.then(function(res){
				console.log("Pushing to 'origin'");
				return exec('git push origin master');
			});
		}).then(function(res){
			console.log(res.stdout);
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
