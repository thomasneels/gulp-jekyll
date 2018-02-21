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

getVersion = () => JSON.parse(fs.readFileSync('./package.json').toString()).version;

gulp.task('checkout', function(){
	version = JSON.parse(fs.readFileSync('./package.json').toString()).version;
	git.checkout(`release/v${getVersion()}`, {args:'-b'}, function (err) {
		if (err) throw err;
	});
});

// push on the new branch
gulp.task('push', function(){
  git.push('origin', {args: " HEAD"}, function (err) {
    if (err) throw err;
  });
});
