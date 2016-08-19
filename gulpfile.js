var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dev'
        }
    });
});

gulp.task('watch', function() {
    gulp.watch('dev/css/*.css', browserSync.reload);
    gulp.watch('dev/js/*.js', browserSync.reload);
    gulp.watch('dev/img/*.*', browserSync.reload);
    gulp.watch('dev/fonts/**/*', browserSync.reload);
    gulp.watch('dev/*.html', browserSync.reload);
});

gulp.task('useref', function() {
    return gulp.src('dev/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
    return gulp.src('dev/img/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('fonts', function() {
    return gulp.src('dev/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('cache:clear', function(cb) {
    return cache.clearAll(cb);
});

gulp.task('clean:dist', function() {
    return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

gulp.task('default', function(cb) {
    runSequence(['browserSync', 'watch'], cb);
});

gulp.task('build', function(cb) {
    runSequence('clean:dist', ['useref', 'images', 'fonts'], cb);
});
