var gulp = require('gulp');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var wait = require('gulp-wait');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var del = require('del');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

gulp.task('scripts', function() {
    return gulp.src('js/scripts.js')
        .pipe(plumber(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        })))
        .pipe(uglify({
            output: {
                comments: '/^!/'
            }
        }))
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('js'));
});

gulp.task('styles', function () {
    return gulp.src('./scss/styles.scss')
        .pipe(wait(250))
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('usemin', function() {
    return gulp.src('./*.html')
    .pipe(flatmap(function(stream, file){
        return stream
          .pipe(usemin({
              css: [ rev() ],
              html: [ function() { return htmlmin({ collapseWhitespace: true })} ],
              js: [ uglify(), rev() ],
              inlinejs: [ uglify() ],
              inlinecss: [ cleanCss(), 'concat' ]
          }))
      }))
      .pipe(gulp.dest('dist/'));
  });
  
  gulp.task('build',['clean'], function() {
      gulp.start('copyfonts','imagemin','usemin','css','js');
  });

gulp.task('watch', ['scripts', 'styles'], function() {
    gulp.watch('js/*.js', ['scripts']);
    gulp.watch('scss/*.scss', ['styles']);
});

// Clean
gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('copyfonts', function() {
   gulp.src('./libs/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('css', function() {
    gulp.src('./css/*.css')
    .pipe(gulp.dest('./dist/css'));
 });
 gulp.task('js', function() {
    gulp.src('./js/*.js')
    .pipe(gulp.dest('./dist/js'));
 });

// Images
gulp.task('imagemin', function() {
    return gulp.src('images/*.{png,jpg,gif}')
      .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
      .pipe(gulp.dest('dist/images'));
  });

gulp.task('browser-sync', function () {
    var files = [
       './*.html',
       './css/*.css',
       './images/*.{png,jpg,gif}',
       './js/*.js'
    ];
 
    browserSync.init(files, {
       server: {
          baseDir: "./"
       }
    });
 
 });

 // Default task
gulp.task('default', ['browser-sync'], function() {
    gulp.start('watch');
});
