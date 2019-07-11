'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
var connectSSI   = require('connect-ssi');
var fileinclude =  require('gulp-file-include');

var src = './';	//작업 폴더

// 경로
var path = {
	css: src + '/cjom/**/css/**/*.css',
	js: src + '/cjom/**/js/**/*.js',
	html: src + '/cjom/**/*.html'
};

// server root
var server = {
	baseDir: src,
	middleware: [
		connectSSI({
			baseDir: src,
			ext: '.html'
		})
	]
};
// html 덤프 ./index.html -> ./cjom/index.html
gulp.task('html', function () {
	gulp.src('./index.html')
		.pipe(gulp.dest('./cjom/'))
		.pipe(connect.reload());
});

gulp.task('fileinclude', function() {
	gulp.src([path.html])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: `./cjom/mobile/include/`
		}))
		.pipe(gulp.dest('./temp/'))
})

gulp.task('connect', function() {
	connect.server({
		root: src,
		livereload: false,
		port: 3000
	})
})

// gulp.task('browserSync', function() {
// 	browserSync.init({
//         port: 3000,
// 		open: true,
// 		server: server
// 	})
// 	// gulp.watch(path.css).on('change', browserSync.reload);
// 	// gulp.watch(path.js).on('change', browserSync.reload);
// 	// gulp.watch(path.html).on('change', browserSync.reload);
// 	// gulp.watch(['./index.html'], ['html'])
// });

gulp.task('dest', function(){
	return gulp.src(path.html)
		.pipe(gulp.dest('dist'))
})

// default
gulp.task('default', ['connect', 'html']);