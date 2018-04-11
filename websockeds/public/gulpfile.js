/*jslint node: true */
"use strict";

var $           = require('gulp-load-plugins')();
var argv        = require('yargs').argv;
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var merge       = require('merge-stream');
var sequence    = require('run-sequence');
var colors      = require('colors');
var dateFormat  = require('dateformat');
var del         = require('del');
var cleanCSS    = require('gulp-clean-css');
var imagemin    = require('gulp-imagemin');

// Enter URL of your local server here
// Example: 'http://localwebsite.dev'
var URL = 'http://localhost:3333';

// Check for --production flag
var isProduction = !!(argv.production);

// Browsers to target when prefixing CSS.
var COMPATIBILITY = [
  'last 2 versions',
  'ie >= 9',
  'Android >= 2.3'
];

// File paths to various assets are defined here.
var PATHS = {
  sass: [
     'scss',
  ],
  javascript: [
    'js/global.js',
    'js/custom/*.js',
  ],
  javascriptLogin: [
    'js/global.js',
    'js/customLogin/*.js',
  ],
 
  pkg: [
    '**/*',
    '!**/node_modules/**',
    '!**/components/**',
    '!**/scss/**',
    // '!**/bower.json',
    '!**/gulpfile.js',
    '!**/package.json',
    '!**/composer.json',
    '!**/composer.lock',
    '!**/codesniffer.ruleset.xml',
    '!**/packaged/*',
  ]
};

// Browsersync task
gulp.task('browser-sync', ['build'], function() {

  var files = [
            '../html/**/*.html',
            'assets/images/**/*.{png,jpg,gif}',
          ];

  browserSync.init(files, {
    // Proxy address
    proxy: URL,

    // Port #
     port: 5000
  });
});

// Compile Sass into CSS
// In production, the CSS is compressed
gulp.task('sass', function() {
  return gulp.src('scss/styles.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sass
    }))
    .on('error', $.notify.onError({
        message: "<%= error.message %>",
        title: "Sass Error"
    }))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))
    // Minify CSS if run with --production flag
    .pipe($.if(isProduction, cleanCSS()))
    .pipe($.if(!isProduction, $.sourcemaps.write('.')))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

// Lint all JS files in custom directory
gulp.task('lint', function() {
  return gulp.src([, 'js/custom/*.js', 'js/customLogin/*.js'])
    .pipe($.jshint())
    .pipe($.notify(function (file) {
      if (file.jshint.success) {
        return false;
      }

      var errors = file.jshint.results.map(function (data) {
        if (data.error) {
          return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
      }).join("\n");
      return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
    }));
});

// Combine JavaScript into one file
// In production, the file is minified
gulp.task('javascript', function() {
  var uglify = $.uglify()
    .on('error', $.notify.onError({
      message: "<%= error.message %>",
      title: "Uglify JS Error"
    }));

  return gulp.src(PATHS.javascript)
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.concat('chat-scripts.js', {
      newLine:'\n;'
    }))
    .pipe($.if(isProduction, uglify))
    .pipe($.if(!isProduction, $.sourcemaps.write('.')))
    .pipe(gulp.dest('js'))
    .pipe(browserSync.stream());
});

gulp.task('javascriptLogin', function () {
  var uglify = $.uglify()
    .on('error', $.notify.onError({
      message: "<%= error.message %>",
      title: "Uglify JS Error"
    }));

  return gulp.src(PATHS.javascriptLogin)
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.concat('login-scripts.js', {
      newLine: '\n;'
    }))
    .pipe($.if(isProduction, uglify))
    .pipe($.if(!isProduction, $.sourcemaps.write('.')))
    .pipe(gulp.dest('js'))
    .pipe(browserSync.stream());
});

// Copy task
// gulp.task('copy', function() {
//   // Font Awesome
//   var fontAwesome = gulp.src('assets/components/fontawesome/fonts/**/*.*')
//       .pipe(gulp.dest('assets/fonts'));

//   return merge(fontAwesome);
// });

// Package task
gulp.task('package', ['build'], function() {
  var fs = require('fs');
  var time = dateFormat(new Date(), "yyyy-mm-dd_HH-MM");
  var pkg = JSON.parse(fs.readFileSync('./package.json'));
  var title = 'jon_tryggvi_mandatory'+ time + '.zip';

  return gulp.src(PATHS.pkg)
    .pipe($.zip(title))
    .pipe(gulp.dest('packaged'));
});

// Build task
// Runs copy then runs sass & javascript in parallel
gulp.task('build', ['clean'], function(done) {
  sequence(
    ['sass', 'javascript', 'javascriptLogin', 'lint'],
          done);
});



// Clean task
gulp.task('clean', function(done) {
  sequence(['clean:javascript', 'clean:javascriptLogin', 'clean:css'], done);
});

// Clean JS
gulp.task('clean:javascript', function() {
  return del([
      'js/chat-scripts.js',
      'js/chat-scripts.js.map'
    ]);
});

gulp.task('clean:javascriptLogin', function () {
  return del([
    'js/login-scripts.js',
    'js/login-scripts.js.map'
  ]);
});

// Clean CSS
gulp.task('clean:css', function() {
  return del([
      'css/styles.css',
      'css/styles.css.map'
    ]);
});

// Default gulp task
// Run build task and watch for file changes
gulp.task('default', ['build', 'browser-sync'], function() {
  // Log file changes to console
  function logFileChange(event) {
    var fileName = require('path').relative(__dirname, event.path);
    console.log('[' + 'WATCH'.green + '] ' + fileName.magenta + ' was ' + event.type + ', running tasks...');
  }

  // Sass Watch
  gulp.watch(['scss/**/*.scss'], ['clean:css', 'sass'])
    .on('change', function(event) {
      logFileChange(event);
    });

  // JS Watch
  gulp.watch(['js/custom/**/*.js', 'js/customLogin/**/*.js', 'js/global.js'], ['clean:javascript', 'javascript', 'clean:javascriptLogin', 'javascriptLogin', 'lint'])
    .on('change', function(event) {
      logFileChange(event);
    });
});




gulp.task('img', () =>
  gulp.src('imgUnpress/*')
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 10 }),
     
    ]))
    .pipe(gulp.dest('img'))
);
