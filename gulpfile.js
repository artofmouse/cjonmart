'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var bs = require('browser-sync').create();
var connectSSI   = require('connect-ssi');

var src = './';	//작업 폴더

// 경로
var path = {
	css: src + '/cjom/mobile/css/**/*.css',
	js: src + '/cjom/mobile/js/**/*.js',
	html: src + '/cjom/mobile/html/*.html'
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
gulp.task('html', () => {
	gulp.src('./index.html')
			.pipe(gulp.dest('./cjom/'))
			.pipe(connect.reload());
});

gulp.task('browsersync', () => {
	bs.init({
		port: 3000,
		open: true,
		server: server
	})
});

gulp.task('watch', () => {
	/*gulp.watch(path.css).on('change', e => gulp.src(e.path).pipe(bs.stream()));
	gulp.watch(path.js).on('change', e => gulp.src(e.path).pipe(bs.reload({stream: true})));
	gulp.watch(path.html).on('change', e => gulp.src(e.path).pipe(bs.reload({stream: true})));
	gulp.watch(['./index.html'], ['html']);*/
})

// default
gulp.task('default', ['browsersync', 'html', 'watch']);
