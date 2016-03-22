var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('script', function () {
  return gulp.src('./src/LnSlider.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('default', ['script']);