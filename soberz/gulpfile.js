/*jslint node: true */
"use strict";
var $ = require('gulp-load-plugins')()
var esHint = require('gulp-eslint')
var argv = require('yargs').argv
var gulp = require('gulp')
var browserSync = require('browser-sync').create()
var merge = require('merge-stream')
var sequence = require('run-sequence')
var colors = require('colors')
var dateFormat = require('dateformat')
var del = require('del')
var cleanCSS = require('gulp-clean-css')
var imagemin = require('gulp-imagemin')
var spawn = require('child_process').spawn
var node;
var promisify = require( 'gulp-promisify' );



promisify(gulp);

async function startServer() {
  if (node) node.kill();
  node = await spawn("node", ["server.js"], { stdio: "inherit" });

  node.on("close", function (code) {
    if (code === 8) {
      console.log("Error detected, waiting for changes...");
    }
  });
}
startServer()
var URL = 'http://localhost:1981';

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
  server: ['./routes.js','./controllers/*.js','./html/*.html', './components/*.html', './server.js'],
  sass: [

    "./node_modules/@material/floating-label/mdc-floating-label.scss",
    'scss',
  ],
  javascript: [
    // MDCPersistentDrawer,
    // MDCPersistentDrawerFoundation,
    // util,
    'public/materialize-src/js/bin/materialize.min.js',
    './node_modules/dropify/dist/js/dropify.min.js',
    'public/js/global.js',
    'public/js/custom/*.js',
  ],
  javascriptLogin: [
    'public/materialize-src/js/bin/materialize.min.js',
    'public/js/global.js',
    'public/js/customLogin/*.js',
  ],
  javascriptChat: [
    'public/materialize-src/js/bin/materialize.min.js',
    'public/js/global.js',
    'public/js/customChat/*.js',
  ],
  javascriptUsers: [
    'public/materialize-src/js/bin/materialize.min.js',
    'public/js/global.js',
    'public/js/customUsers/*.js',
  ],
  javascriptSignup: [
    'public/materialize-src/js/bin/materialize.min.js',
    './node_modules/dropify/dist/js/dropify.min.js',
    'public/js/global.js',
    'public/js/customSignup/*.js',
  ],
  javascriptAbout: [
    'public/materialize-src/js/bin/materialize.min.js',
    './node_modules/dropify/dist/js/dropify.min.js',
    'public/js/global.js',
    'public/js/customAbout/*.js',
  ],
  pkg: [
 
    '**/*',
    '!**/node_modules/**',
    '!**/live',
    '!**/public/js/custom/**/*.{js,map}',
    '!public/js/customLogin/**/*.{js,map}',
    '!public/js/customUsers/**/*.{js,map}',
    '!public/js/customChat/**/*.{js,map}',
    '!public/js/customSignup/**/*.{js,map}',
    '!public/materialize-src/**',
    // '!**/components/**',
    '!**/scss/**',
    // '!**/bower.json',
    '!**/gulpfile.js',
    '!**/package-lock.json',
    '!**/composer.json',
    '!**/composer.lock',
    '!**/codesniffer.ruleset.xml',
    '!**/packaged/*',
  ]
};

// Browsersync task
gulp.task('browser-sync', ['build'], function () {
  var files = [
    './components/**/*.html',
    './html/**/*.html',
    'public/img/**/*.{png,jpg,gif}',
  ];

  browserSync.init(files, {
    // Proxy address
    proxy: URL,
    // Port #
    port: 4545
  });
});

// Compile Sass into CSS
// In production, the CSS is compressed
gulp.task('sass', function () {
  return gulp.src('public/scss/styles.scss')
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
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});

// Lint all JS files in custom directory 
gulp.task('lint', function () {
  return gulp.src(['public/js/custom/**/*.js', 'public/js/customLogin/**/*.js', 'public/js/customSignup/**/*.js', 'public/js/customChat/**/*.js', 'public/js/customUsers/**/*.js', 'public/js/global.js'])
    .pipe(esHint())
    .pipe($.notify(function (file) {
      console.log(file);
      
      if (file.esHint.success) {
        return false;
      }

      var errors = file.esHint.results.map(function (data) {
        if (data.error) {
          return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
      }).join("\n");
      return file.relative + " (" + file.esHint.results.length + " errors)\n" + errors;
    }));
});

// Combine JavaScript into one file
// In production, the file is minified
function jsFun(task, scriptname) {
  gulp.task(task, function () {
    var uglify = $.uglify()
      .on('error', $.notify.onError({
        message: "<%= error.message %>",
        title: "Uglify JS Error"
      }));

    return gulp.src(PATHS[task])
      .pipe($.sourcemaps.init())
      .pipe($.babel())
      .pipe($.concat(scriptname, {
        newLine: '\n;'
      }))
      .pipe($.if(isProduction, uglify))
      .pipe($.if(!isProduction, $.sourcemaps.write('.')))
      .pipe(gulp.dest('public/js'))
      .pipe(browserSync.stream());
  });
}
jsFun('javascript', 'profile-scripts.js');
jsFun('javascriptLogin', 'login-scripts.js');
jsFun('javascriptChat', 'chat-scripts.js');
jsFun('javascriptUsers', 'users-scripts.js');
jsFun('javascriptSignup', 'signup-scripts.js');
jsFun('javascriptAbout', 'about-scripts.js');

gulp.task('package', ['build'], function () {
  var fs = require('fs');
  var time = dateFormat(new Date(), "yyyy-mm-dd_HH-MM");
  var pkg = JSON.parse(fs.readFileSync('./package.json'));
  var title = 'soberz' + time + '.zip';

  return gulp.src(PATHS.pkg)
    .pipe($.zip(title))
    .pipe(gulp.dest('packaged'));
});

// Build task
// Runs copy then runs sass & javascript in parallel
gulp.task('build', ['clean'], function (done) {
  sequence(
    ['sass', 'javascript', 'javascriptLogin', 'javascriptChat', 'javascriptUsers', 'javascriptSignup', 'javascriptAbout'],
    done);
});



// Clean task
gulp.task('clean', function (done) {
  sequence(['clean:javascript', 'clean:javascriptLogin', 'clean:javascriptChat', 'clean:javascriptUsers', 'clean:javascriptSignup', 'clean:javascriptAbout', 'clean:css'], done);
});

// Clean JS
function cleanfun(task) {
  gulp.task(`clean:${task}`, function () {
    return del([
      `js/${task}-scripts.js`,
      `js/${task}-scripts.js.map`
    ]);
  });
}

cleanfun('javascript')
cleanfun('javascriptLogin')
cleanfun('javascriptChat')
cleanfun('javascriptUsers')
cleanfun('javascriptSignup')
cleanfun('javascriptAbout')


// Clean CSS
gulp.task('clean:css', function () {
  return del([
    'css/styles.css',
    'css/styles.css.map'
  ]);
});

// Default gulp task
// Run build task and watch for file changes
gulp.task('default', ['build', 'browser-sync'], function () {
  gulp.watch(
    PATHS.server,
    {
      queue: false,
      ignoreInitial: false // Execute task on startup 
    },
    startServer);
  // Log file changes to console
  function logFileChange(event) {
    var fileName = require('path').relative(__dirname, event.path);
    console.log('[' + 'WATCH'.green + '] ' + fileName.magenta + ' was ' + event.type + ', running tasks...');
  }
 
  // Sass Watch
  gulp.watch(['public/scss/**/*.scss'], ['clean:css', 'sass'])
    .on('change', function (event) {
      logFileChange(event);
    });

  // JS Watch
  gulp.watch([
    'public/js/custom/**/*.js',
    'public/js/customLogin/**/*.js',
    'public/js/customChat/**/*.js',
    'public/js/customSignup/**/*.js',
    'public/js/customUsers/**/*.js',
    'public/js/customAbout/**/*.js',
    'public/js/global.js'
  ],
  [
    'clean:javascript', 'javascript',
    'clean:javascriptLogin','javascriptLogin',
    'clean:javascriptChat', 'javascriptChat',
    'clean:javascriptSignup', 'javascriptSignup',
    'clean:javascriptUsers', 'javascriptUsers',
    'clean:javascriptAbout', 'javascriptAbout'
  ]
  ).on('change', function (event) {
      logFileChange(event);
    });
 
});

// clean up if an error goes unhandled.
process.on('exit', function () {
  if (node) node.kill()
})



