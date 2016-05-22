/*
 Copyright 2015 Loïc Ortola
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
var gulp = require('gulp');
var del = require('del');
var rev = require('gulp-rev');
var vinylPaths = require('vinyl-paths');
var compass = require('gulp-compass');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var request = require('request');
var replace = require('gulp-replace');
var rename = require("gulp-rename");
var SwaggerParser = require('swagger-parser');
var fs = require('fs');
var Conf = require('./conf/conf.js.release');

var serve = require('gulp-serve');
var watch = require('gulp-watch');
var debug = require('gulp-debug');

// Copy all assets to public directory
gulp.task('copyAssets', function () {
  gulp.src('./app/img/**')
      .pipe(gulp.dest('./public/img'));
  gulp.src(['./app/fonts/**'])
      .pipe(gulp.dest('./public/fonts'));

});

// CSS Minify
gulp.task('compass', function () {
  return gulp.src('app/styles/**/*.scss')
      .pipe(compass({            //Execute compass
        sass: 'app/styles/sass', //Source sass files
        css: 'public/styles'    //Target directory for compiled css files
      }))
      .pipe(minifyCss())         //Execute css minification
      .pipe(gulp.dest('public/styles'));  //Target directory for minified css files
});

// Concat and uglify all js files and CSS according to html files commented tokens. Needs rearrangement once done
gulp.task('usemin', function () {
  return gulp.src('app/views/*.html')
      .pipe(usemin({
        css: [rev],
        html: [function () {
          return minifyHtml({empty: true});
        }],
        js: [uglify, rev],
        inlinejs: [uglify],
        inlinecss: [minifyCss, 'concat']
      }))
      .pipe(gulp.dest('public/'));
});

// Move Html files from public to node views
gulp.task('moveHtml', ['usemin'], function () {
  return gulp.src('public/*.html')
      .pipe(vinylPaths(del))
      .pipe(gulp.dest('views'));
});

// Convert Swagger json spec from actual yaml
gulp.task('swaggerConvert', function () {
  var swaggerSrc = 'swagger';
  var swaggerDst = 'public/swagger';
  var swaggerBasePath = Conf.server.scheme + '://' + Conf.server.host + ':' + Conf.server.port + Conf.server.path + '/swagger';
  
  // Copy swagger static ui to destination
  gulp.src(swaggerSrc + '/ui/**')
      .pipe(gulp.dest(swaggerDst));

  // Convert each spec
  fs.readdir(swaggerSrc, function (err, data) {
    data.forEach(function (f) {
      if (f.endsWith(".yaml")) {
        // For each yaml, validate it against the Swagger spec with parser
        SwaggerParser.validate(swaggerSrc + '/' + f, {
          $refs: {
            internal: false   // Don't dereference internal $refs, only external
          }
        }).then(function (api) {
          // Parsing success, output to dist directory
          var version = f.substr(0, f.length - ".yaml".length);
          var specFile = version + ".json";
          var staticFile = version + ".html";
          fs.writeFileSync(swaggerDst + '/' + specFile, JSON.stringify(api));
          console.log("Swagger spec " + specFile + " converted successfully.");
          // Now create relevant static file from template
          gulp.src([swaggerSrc + '/ui/template.html'])
              .pipe(replace('{swaggerPath}', swaggerBasePath + '/' + specFile))
              .pipe(rename(staticFile))
              .pipe(gulp.dest(swaggerDst));
        });
      }

    });

  });


});

// Servers
gulp.task('server-dev', serve('public'));
gulp.task('server-prod', serve({
  root: 'public',
  port: 80,
  middleware: function (req, res) {
    // custom optional middleware
  }
}));

// Public publics everything
gulp.task('public', ['compass', 'usemin', 'moveHtml', 'copyAssets']);

// Watching resource changes for dev
gulp.task('watch', function () {
  gulp.watch('app/styles/**/*.scss', ['compass']);
  gulp.watch('app/views/*.html', ['usemin']);
  gulp.watch('app/scripts/**', ['usemin']);
});

// Default does a public
gulp.task('default', ['public']);

// Release does a public + swagger conversion
gulp.task('release', ['public', 'swaggerConvert']);

// Serve publics, launches a dev server, and watches
gulp.task('serve', ['public', 'server-dev', 'watch']);

// Serve-prod publics, launches a prod server, and watches
gulp.task('serve-prod', ['public', 'server-prod', 'watch']);
