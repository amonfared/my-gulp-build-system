var gulp     = require('gulp'),
    gutil        = require('gulp-util'),
    connect      = require('gulp-connect'),
    es           = require('event-stream'),
    sass         = require('gulp-sass'),
    minifyCss    = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint       = require('gulp-jshint'),
    stylish      = require('jshint-stylish'),
    uglify       = require('gulp-uglify'),
    rimraf       = require('rimraf'),
    usemin       = require('gulp-usemin'),
    imagemin     = require('gulp-imagemin');


// Delete build folder
gulp.task('clean-build', function (cb) {
  rimraf('./dist/' , cb)
});

// Server
gulp.task('connect', function() {
  connect.server({
    root: ['./app' , './bower_components'],
    port: 80,
    livereload: true
  });
});


// Html reload
gulp.task('html', function () {
  gulp.src('./app/**/*.html')
    .pipe(connect.reload());
});

// sass compiler task
gulp.task('sass', function () {
  gulp.src('./app/styles/main.scss')
    .pipe(sass({
      onError: function (error) {
        gutil.log(gutil.colors.red.bold(error));
        gutil.beep();
      },
      onSuccess: function () {
        gutil.log(gutil.colors.green.bold('Sass compiled successfully.'));
      }
    }))
    /*.pipe(sass({ style: 'expanded' }))*/
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 9'],
    }))
    .on('error', console.error)
    .pipe(gulp.dest('./app/styles/'))
    .pipe(connect.reload());
});

// Minify images
gulp.task('imagemin', function () {
  es.concat(
    gulp.src('./app/images/**/*.png')
      .pipe(imagemin())
      .pipe(gulp.dest('./dist/images')),
    gulp.src('./app/images/**/*.jpg')
      .pipe(imagemin())
      .pipe(gulp.dest('./dist/images')),
    gulp.src('./app/images/**/*.gif')
      .pipe(imagemin())
      .pipe(gulp.dest('./dist/images')),
    gulp.src('./app/images/**/*.svg')
      .pipe(imagemin())
      .pipe(gulp.dest('./dist/images'))
  );
});

// jsHint
gulp.task('jshint', function () {
  gulp.src('./app/scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(connect.reload());
});

// watch
gulp.task('watch', function () {
  gulp.watch([ './app/styles/**/*.scss'], ['sass']);
  gulp.watch([ './app/scripts/**/*.js'], ['jshint']);
  gulp.watch(['./app/**/*.html'], ['html']);
});

// default
gulp.task('default', ['connect', 'sass', 'jshint', 'watch']);



// Prepare Build
gulp.task('usemin', function () {
  gulp.src('./app/*.html')
    .pipe(usemin( {
      css: [minifyCss()],
      js: [uglify()]
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['clean-build', 'sass', 'jshint', 'imagemin', 'usemin']);







