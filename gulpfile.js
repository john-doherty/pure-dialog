'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var gulpCssDataUri = require('gulp-css-base64');
var rename = require('gulp-rename');
var del = require('del');
var runSequence = require('run-sequence');
var replace = require('gulp-string-replace');
var pjson = require('./package.json');
var sizereport = require('gulp-sizereport');

gulp.task('clean', function () {
    return del(['dist']);
});

gulp.task('build-js', function () {
    return gulp.src('./src/*.js')
        .pipe(uglify({
            compress: {
                passes: 2
            },
            output: {
                comments: /^!/
            }
        }))
        .pipe(replace(new RegExp('@version@', 'g'), pjson.version))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-css', function () {
    return gulp.src('./src/*.css')
        .pipe(cleanCSS({
            inline: 'local',
            compatibility: 'ie9',
            specialComments: true
        }))
        .pipe(gulpCssDataUri({
            //baseDir: "src/img",
            extensionsAllowed: ['.gif', '.png', '.svg']
        }))
        .pipe(replace(new RegExp('@version@', 'g'), pjson.version))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'));
});

gulp.task('sizereport', function () {
    return gulp.src('./dist/*')
        .pipe(sizereport({
            gzip: true
        }));
});

gulp.task('build', function (callback) {
    runSequence(
        'clean',
        'build-js',
        'build-css',
        'sizereport',
        callback
    );
});
