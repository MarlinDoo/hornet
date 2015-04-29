// load the plugins
var gulp      = require('gulp');
var less      = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename    = require('gulp-rename');
var jshint    = require('gulp-jshint');
var concat    = require('gulp-concat');
var uglify    = require('gulp-uglify');
var nodemon   = require('gulp-nodemon');

var BROWSER_SYNC_RELOAD_DELAY = 500;
var browserSync = require('browser-sync');

var reload = browserSync.reload;

gulp.task('css', function() {
  return gulp.src('public/assets/css/style.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/assets/css'));

});
gulp.task('scripts', function() {
return gulp.src(['public/app/*.js', 'public/app/**/*.js'])
          .pipe(jshint())
          .pipe(jshint.reporter('default'))
          .pipe(concat('all.js'))
          .pipe(uglify())
          .pipe(gulp.dest('public/dist'));
});

// task to watch
gulp.task('watch', function() {
  // watch the less file and run the css task
  gulp.watch('public/assets/css/style.less', ['css']);
  // watch js files and run lint and run js and angular tasks
  gulp.watch(['server.js', 'public/app/*.js', 'public/app/**/*.js'], ['js']);
});

// the nodemon task
var called = false;
gulp.task('nodemon', function(cb) {
  nodemon({
    script: 'server.js',
    ext: 'js html'
  })
  .on('start',function(){
    if (!called) { cb(); }
    called = true;
  })
  .on('restart', function() {
    setTimeout(function reload() {
      browserSync.reload({
        stream: false
      });
    }, BROWSER_SYNC_RELOAD_DELAY);
  });
});


gulp.task('serve',['css','nodemon'],function(){
  browserSync({
    notify: false,
    proxy: 'http://127.0.0.1:8080',
    port:4000
  });
  gulp.watch('public/assets/css/style.less',['css',reload]);
});
gulp.task('default', ['serve']);