var config       = require('../../config').styles;

var gulp         = require('gulp');
var postcss      = require('gulp-postcss');
var sass         = require('gulp-sass');
// var sass 		 = require('gulp-ruby-sass');
var precss       = require('precss');
var autoprefixer = require('autoprefixer');
var mqpacker     = require('css-mqpacker');
var cssnano      = require('cssnano');
var plumber      = require('gulp-plumber');
var sourcemaps   = require('gulp-sourcemaps');
var gutil        = require('gulp-util');
var browsersync  = require('browser-sync');

function onError (err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
}


// Run CSS through PostCSS and it’s plugins.
// Build sourcemaps and minimize.
gulp.task('styles', function() {
  browsersync.notify('Transforming CSS with PostCSS');

  // PostCSS plugins
  var processors = [
    precss(config.options.precss),
    autoprefixer(config.options.autoprefixer),
    mqpacker(config.options.mqpacker),
    cssnano()
  ];

  return gulp.src(config.src)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sourcemaps.init())
    // .pipe(postcss(processors))
	// .pipe(autoprefixer(config.options.autoprefixer))  // test
	// .pipe(mqpacker(config.options.mqpacker)) // test
    .pipe(sass())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest));


  // return sass(config.src, {sourcemap: true})
	// .on('error', sass.logError)
	// .pipe(sourcemaps.write('maps', {
  //           includeContent: false,
  //           sourceRoot: config.src
  //       }))
  //   .pipe(gulp.dest(config.dest));
});
