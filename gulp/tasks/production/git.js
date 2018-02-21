const config = require('../../config').git;

const gulp = require('gulp');
const git = require('gulp-git');
const logger = require('gulp-logger');
const package_json = require('../../../package.json');
const argv = require('yargs').argv;
const jeditor = require('gulp-json-editor');
const _ = require('lodash/core');
const bump = require('gulp-bump');
const fs = require('fs');
const gulpsync = require('gulp-sync')(gulp);
const gulpSequence = require('gulp-sequence');
let version = JSON.parse(fs.readFileSync('./package.json').toString()).version;

/*
	To make a release of the project, run in console the following script :
 	npm run release
	It will increment version project, create the new branch, switch to it and push folders
*/

// Create a git branch and switch to it
gulp.task('bump', () => {

	// increment with args (--major / --minor / --patch)
	// default to --patch
	let v;
	switch (true) {
		case argv.patch:
			v = 'patch'
			break;
		case argv.minor:
			v = 'minor'
			break;
		case argv.major:
			v = 'major'
			break;
		default:
			v = 'patch';
	}

	gulp.src(['./package.json', './bower.json'])
	    .pipe(bump({type: v}))
	    .pipe(gulp.dest('./'))
		.once('end', function () {
			version = JSON.parse(fs.readFileSync('./package.json').toString()).version;
			return version;
		});
});

// Récupération du nom de l'application à build/développer
function getAppName() {
	var build_name;

	if (app_specific && conf.specific && conf.specific[app_specific]) {
		build_name = conf.specific[app_specific].build_name;
	}

	if (!build_name) {
		logger.error('Il manque le "build_name" dans la conf (build_conf.json)');
		return;
	}

	return build_name;
}

function getBranch() {
	git.revParse({args:' --abbrev-ref HEAD'}, function (err, branch) {
		// console.log('current git branch: ' + branch);  // return "develop" or "master"
		return branch;
	});
};

function getVersion() {
	var versionArr = package_json.version.split('.');
	// console.log(`package_json.version : ${version}`);
	return versionArr; // return 0.1.0
};

getVersion = () => JSON.parse(fs.readFileSync('./package.json').toString()).version;

gulp.task('checkout', function(){
	version = JSON.parse(fs.readFileSync('./package.json').toString()).version;
	git.checkout(`release/v${getVersion()}`, {args:'-b'}, function (err) {
		if (err) throw err;
	});
});

// push on the new branch
gulp.task('push', function(){
  git.push(`release/v${getVersion()}`, {args: " --set-upstream"}, function (err) {
    if (err) throw err;
  });
});
