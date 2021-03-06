// Global Modules
var gulp       = require('gulp');
var rename     = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var gulpif     = require('gulp-if');
var argv       = require('minimist')(process.argv.slice(2));
var livereload = require('gulp-livereload');
var concat     = require('gulp-concat');
var gutil      = require('gulp-util');

// Scripts Modules
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var coffeeify = require('coffeeify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');

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

gulp.task('coffee', function () {

    var source_dir = config.src_dir + config.scripts.src_dir;
    var dest_dir = config.dest_dir + config.scripts.dest_dir;
    // set up the browserify instance on a task basis
    var b = browserify({
      extensions: ['.coffee']
    });

    b.transform(coffeeify, {
      bare: false,
      header: true
    });

    b.add(source_dir + 'app.coffee')

    return b.bundle()
      .pipe(source(source_dir + 'app.coffee'))
      .on('error', gutil.log)
      .pipe( rename('scripts.js') )
      // .pipe( gulpif( enabled.maps, sourcemaps.init({ loadMaps: true }) ) )
      // .pipe( gulpif( enabled.maps, sourcemaps.write('.') ) )
      .pipe( gulp.dest(dest_dir) )
      .pipe( livereload() );
});

gulp.task('scripts', gulp.series('coffee', function() {
  var dest_dir = config.dest_dir + config.scripts.dest_dir;
  return gulp.src(dest_dir + 'scripts.js')
      .pipe( gulpif( enabled.minify, uglify() ) )
      .pipe( gulp.dest(dest_dir) );
}));
