'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const fontgen = require('gulp-fontgen');
const favicons = require('gulp-favicons');

gulp.task('server', function () {
  browserSync.init({
    server: './src/html/',
    notify: false
  });
});

gulp.task('style', function () {
  return gulp.src('src/style/main.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss(
      autoprefixer({
        browsers: [
          'last 1 version',
          'last 2 Chrome versions',
          'last 2 Firefox versions',
          'last 2 Opera versions',
          'last 2 Edge versions'
        ]
      })
    ))
    .pipe(gulp.dest('src/style/'));
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

gulp.task('gen-favicons', function () {
  return gulp.src('src/favicon/favicon.png')
    .pipe(favicons({
      appName: '',
      appDescription: '',
      background: "#fff",
      path: '',
      url: '',
      display: "standalone",
      orientation: "portrait",
      version: 1.0
    }))
    .pipe(gulp.dest('src/favicon/'));
});