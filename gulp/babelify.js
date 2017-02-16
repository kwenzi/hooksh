import gulp from 'gulp';
import uglify from 'gulp-uglify';
import gutil from 'gulp-util';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import concat from 'gulp-concat';

const babelPresets = {'presets': [ 'es2015']}

/**
 * Babel transform, include sourcemaps as separate files
 */
export const dev = (src, dest) => () => {
  return gulp.src(src)
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(babel(babelPresets))
  .on('error', gutil.log.bind(gutil, 'Babel error'))
//  .pipe(sourcemaps.write()) // inline sourcemaps
  .pipe(sourcemaps.write('.', {includeContent: true})) // separate files
  .pipe(gulp.dest(dest));
}

/**
 * Babel transform, minify
 */
export const prod = (src, dest) => () => {
  return gulp.src(src)
  .pipe(babel(babelPresets))
  .on('error', gutil.log.bind(gutil, 'Babel error'))
  .pipe(uglify())
  .pipe(gulp.dest(dest));
};
