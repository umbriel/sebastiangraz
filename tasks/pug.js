// Global Modules
var gulp       = require('gulp');
var rename     = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var gulpif     = require('gulp-if');
var argv       = require('minimist')(process.argv.slice(2));
var livereload = require('gulp-livereload');

// Pug Modules
var pug = require('gulp-pug');

// Configuration
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config.json'));

// CLI options
var enabled = {
  // Disable source maps when `--production`
  maps: !argv.production,
  // Fail styles task on error when `--production`
  minify: argv.production,
};

gulp.task('templates', function() {

  var source_dir = config.src_dir + config.pug.src_dir;
  var dest_dir = config.dest_dir + config.pug.dest_dir;

  return gulp.src( source_dir + '**/!(_)*.pug' )
    .pipe( pug({
    	compileDebug: false,
    	pretty: !enabled.minify
    }) )
    .pipe( rename(function(path) {
    	path.extname = config.pug.extension;
    }) )
    .pipe( gulp.dest(dest_dir) )
    .pipe( livereload() )
});
