'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const fontgen = require('gulp-fontgen');
const favicons = require('gulp-favicons');
const runSequence = require('run-sequence');
const del = require('del');
const imagemin = require('gulp-imagemin');

gulp.task('style', function () {
  return gulp.src('src/style/main.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: [
          'last 1 version',
          'last 2 Chrome versions',
          'last 2 Firefox versions',
          'last 2 Opera versions',
          'last 2 Edge versions'
        ]
      })
    ]))
    .pipe(gulp.dest('src/style/'))
    .pipe(browserSync.stream());
});

gulp.task('server', function () {
  browserSync.init({
    server: 'src/',
    notify: false
  });

  gulp.watch('src/*.html').on('change', browserSync.reload);

  gulp.watch('src/style/**/*.{scss,sass}', ['style']);

  gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
});

gulp.task('gen-sprite', function () {
  return gulp.src('src/icons/*.svg')
    .pipe(svgo({
      plugins: [
        {removeTitle: true},
        {removeUselessDefs: true},
        {removeEmptyContainers: true},
        {removeXMLProcInst: true},
        {removeComments: true},
        {removeMetadata: true},
        {removeDesc: true},
        {removeXMLNS: true},
        {removeEditorsNSData: true},
        {removeEmptyAttrs: true},
        {removeHiddenElems: true},
        {convertTransform: true},
        {removeStyleElement: true}
      ]
    }))
    .pipe(replace('#000', 'currentColor'))
    .pipe(svgSprite({
      mode: 'symbols',
      preview: false,
      selector: "%f",
      mode: {
        symbol : {
          dest: '',
          sprite: 'sprite.svg',
        }
      },
      svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false,
        namespaceIDs: false,
        dimensionAttributes: false
      }
    }));
});

gulp.task('gen-fonts', function () {
  return gulp.src('src/fonts/*.{ttf,otf}')
    .pipe(fontgen({dest: 'src/fonts/'}));
});

gulp.task('gen-favicon', function () {
  return gulp.src('src/favicon/favicon.png')
    .pipe(favicons({
      appName: '',
      appDescription: '',
      background: '#ffffff',
      url: '',
      display: 'standalone',
      orientation: 'portrait',
      version: 1.0,
      logging: false,
      html: 'favicon.html',
      pipeHTML: true,
      replace: true
    }))
    .pipe(gulp.dest('src/favicon/'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('build-favicon', function () {
  return gulp.src('src/favicon/*.*')
    .pipe(gulp.dest('build/favicon/'));
});

gulp.task('build-fonts', function () {
  return gulp.src('src/fonts/*.*')
    .pipe(gulp.dest('build/fonts/'));
});

gulp.task('build-html', function () {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build/'));
});

gulp.task('build-icons', function () {
  return gulp.src('src/icons/sprite.svg')
    .pipe(gulp.dest('build/icons/'));
});

gulp.task('build-image', function () {
  return gulp.src('src/img/*.{png,jpg,gif}')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img/'));
});

gulp.task('build-js', function () {
  /* TODO: (gulpfile) Пока оставлю так, в дальнейшем надо будет доработать конфиг для работы с модулями и скрипты должны хотя бы минифицироваться */

  return gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('build/js/'));
});

gulp.task('build-style', function () {
  /* TODO: (gulpfile) Аналогично требует ещё внимания, но пока в этом нет смысла */

  return gulp.src('src/style/main.css')
    .pipe(gulp.dest('build/style/'));
});

gulp.task('build', function () {
  runSequence(
    'clean',
    'build-favicon',
    'build-fonts',
    'build-html',
    'build-icons',
    'build-image',
    'build-js',
    'build-style'
  )
});