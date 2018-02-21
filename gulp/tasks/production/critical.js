const argv       = require('yargs').argv;
const critical   = require('critical').stream;
const gulp       = require('gulp');

// Page dimensions for critical CSS
var pageDimensions = [{
		width: 320,
		height: 480
	}, {
		width: 768,
		height: 1024
	}, {
		width: 1024,
		height: 1024
	}, {
		width: 1440,
		height: 1280
	}];

gulp.task('styles:critical:home', () => {
  return gulp.src('build/index.html')
    .pipe(critical({
		base: './',
		css: ['build/assets/css/main.css'],
		dimensions: pageDimensions,
		dest: 'app/_includes/critical-home.css',
		minify: true,
		extract: false,
		ignore: ['@font-face','/print/',/url\(/] // defer loading of webfonts and background images
    }))
});
