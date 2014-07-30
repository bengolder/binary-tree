var gulp        =  require('gulp'),
    istanbul    =  require('gulp-istanbul'),
    jasmine     =  require('gulp-jasmine'),
    uglify      =  require('gulp-uglify'),
    browserify  =  require('browserify'),
    source      =  require('vinyl-source-stream');

var entrypoint = './src/binary_tree.js';
var srcfiles = [ './src/**/*.js' ];
var testfiles = [ './test/**/*.js' ];

var distdir = './dist/';

// Run tests and generate coverage data
gulp.task('test', function(cb) {
	gulp.src(srcfiles)
		.pipe(istanbul())
		.on('finish', function(){
			gulp.src(testfiles)
				.pipe(jasmine({
					verbose: true,
					includeStackTrace: true
				}))
				.pipe(istanbul.writeReports())
				.on('end', cb);
		});
});


// create a single js file
gulp.task('build', function() {
	return browserify(entrypoint, {debug:true})
		.bundle()
		.pipe(source('btree.js'))
		.pipe(gulp.dest(distdir));
});

// watch files for changes
gulp.task('watch', function() {
    gulp.watch('./**/*.js', ['test', 'build']);
});

gulp.task('default', ['test', 'build']);

