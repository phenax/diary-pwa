
const path= require('path');

const gulp= require('gulp');
const sass= require('gulp-sass');
const minify= require('gulp-clean-css');
const autoprefix= require('gulp-autoprefixer');
const rename= require('gulp-rename');
const fileSize = require('gulp-size');


// Directory paths
const SOURCE_DIR= './client';
const BUILD_DIR= './public';


/**
 * Build a source stream(css file stream)
 * @param  {Stream} source$
 * @return {Stream}
 */
const buildCSS= source$ =>
	source$
		.pipe(sass())
		.pipe(autoprefix({ browsers: [ 'last 5 versions' ] }));


/**
 * Build and save the build files
 * @param  {Function} transform
 */
const buildAndSave= (transform=(s => s)) => {

	const styleCSS$= gulp.src(path.resolve(SOURCE_DIR, 'scss/style.scss'));
	const inlineCSS$= gulp.src(path.resolve(SOURCE_DIR, 'scss/inline-styles.scss'));

	transform(buildCSS(styleCSS$))
		.pipe(rename('style.css'))
		.pipe(fileSize())
		.pipe(gulp.dest(path.resolve(BUILD_DIR, 'css')));

	transform(buildCSS(inlineCSS$))
		.pipe(rename('inline-styles.gohtml'))
		.pipe(fileSize())
		.pipe(gulp.dest(path.resolve('views', 'partials')));
};



/*  ############ - TASKS ZONE - #############  */

// Build css task
gulp.task('build:css', () => buildAndSave(stream$ => stream$.pipe(minify())));

// Production build task
gulp.task('prod:css', () => buildAndSave(stream$ => stream$.pipe(minify())));

// Watch css task
gulp.task('watch:css', [ 'build:css' ],
	() => gulp.watch(path.join(SOURCE_DIR, '/scss/**/*.scss'), [ 'build:css' ]));
