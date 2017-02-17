import gulp from 'gulp';

export const copy = (src, dest) => () => {
  return gulp.src(src)
    .pipe(gulp.dest(dest));
}

export default copy;
