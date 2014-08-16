var exec = require('child-process-promise').exec;
var fs = require('q-io/fs');
var q = require('q');
var nfs = require('fs');
var async = require('async-q');

	exec('git add ./*')

.then(function(){

	return exec('git -a -m "'+global.COMMITMSSG.replace(/"/,'\"')+'"'); })

.then(function(){

	return exec('git push'); 
	
});