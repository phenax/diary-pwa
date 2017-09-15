
const path= require('path');

const gulp= require('gulp');
const sass= require('gulp-sass');
const minify= require('gulp-clean-css');
const autoprefix= require('gulp-autoprefixer');
const rename= require('gulp-rename');
const fileSize = require('gulp-size');


// Directory paths
const SOURCE_DIR= './static';
const BUILD_DIR= './webroot';


/**
 * Build a source stream(css file stream)
 * @param  {Stream} source$
 * @return {Stream}
 */
const buildCSS= source$ =>
	source$
		.pipe(sass())
		.pipe(autoprefix({ browsers: [ 'last 4 versions' ] }));


/**
 * Build and save the build files
 * @param  {Function} transform
 */
const buildAndSave= (transform=(s => s)) => {

	const styleCSS$= gulp.src(path.resolve(SOURCE_DIR, 'css/yocket.scss'));
	const inlineCSS$= gulp.src(path.resolve(SOURCE_DIR, 'css/inline-styles.scss'));

	transform(buildCSS(styleCSS$))
		.pipe(rename('style.css'))
		.pipe(fileSize())
		.pipe(gulp.dest(path.resolve(BUILD_DIR, 'css')));

	transform(buildCSS(inlineCSS$))
		.pipe(rename('inline-styles.ctp'))
		.pipe(fileSize())
		.pipe(gulp.dest(path.resolve('src', 'Template', 'Element')));
};



/*  ############ - TASKS ZONE - #############  */

// Build css task
gulp.task('build:css', () => buildAndSave(stream$ => stream$.pipe(minify())));

// Production build task
gulp.task('prod:css', () => buildAndSave(stream$ => stream$.pipe(minify())));

// Watch css task
gulp.task('watch:css', [ 'build:css' ],
	() => gulp.watch(path.join(SOURCE_DIR, '/css/**/*.scss'), [ 'build:css' ]));
