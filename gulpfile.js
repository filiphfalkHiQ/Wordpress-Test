var gulp = require('gulp'),
    less = require('gulp-less'),
    gutil = require('gulp-util');

var path = 'wp-content/themes/twentyseventeen/less/';

gulp.task('less', function(){
    gulp.src(path + 'style.less')
    .pipe(less())
    .on('error', gutil.log)
    .pipe(gulp.dest(path))
});


