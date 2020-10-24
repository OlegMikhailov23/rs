'use strict';

let gulp = require('gulp');

// работа со стилями

let sass = require('gulp-sass');
let plumber = require('gulp-plumber');
let postcss = require('gulp-postcss');
let ccscomb = require('gulp-csscomb');
let autoprefixer = require('autoprefixer');
let mqpacker = require('css-mqpacker');
let minify = require('gulp-csso');
let rename = require('gulp-rename');

let imagemin = require('gulp-imagemin');
let del = require('del');

let server = require('browser-sync').create()

// 1) таск компиляции css
gulp.task('style', async function () {
  gulp.src('source/sass/style.scss') // откуда берем файлы
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        overrideBrowserlist: ['last 15 version', '> 1%', 'ie 8', 'ie 7']
      }),
      mqpacker({
        sort: true
      }),
    ]))
    .pipe(ccscomb())
    .pipe(gulp.dest('source'))
      .pipe(minify())
      .pipe(rename("style.min.css"))

      .pipe(gulp.dest('build')) // конечная директория в продакшн
    .pipe(server.stream());
});
// 2) таск для оптимизации изображений
gulp.task("images", async function () {
  return gulp.src("build/assets/img/**/*.{png,jpg,gif,svg}") // откуда берем файлы
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.mozjpeg({
        quality: 85,
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(gulp.dest("build/assets/img")); // помещаем в эту же папку
});

// 5) запускаем live-server
gulp.task('serve', async function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.scss', gulp.parallel('style'));
  gulp.watch('source/*.html', gulp.parallel('gulpCopy')).on('change', server.reload);
  gulp.watch('source/assets/img/**/*.{png,jpg,gif,svg}', gulp.series('clean', 'copy','copy-fonts', 'copy-img', 'style', 'images')).on('change', server.reload);
})
// 6) таск для строки 111
gulp.task('gulpCopy', async function () {
  return gulp.src([
    'source/*html'
  ])
  .pipe(gulp.dest('build'));
});
// 7) копируем необходимые файлы в продакшн
gulp.task('copy', function async () {
  return gulp.src([
          "source/*html",
          "source/favicon.png",
          "source/normalize.css",
  ])
  .pipe(gulp.dest('build'));
});

gulp.task('copy-fonts', function async () {
    return gulp.src([
        "source/assets/fonts/**/*.{woff,woff2,ttf}",
    ])
        .pipe(gulp.dest('build/assets/fonts'));
});

gulp.task('copy-img', function async () {
    return gulp.src([
        "source/assets/img/**/*.{png,jpg,gif,svg}",
    ])
        .pipe(gulp.dest('build/assets/img'));
});
// 8) стираем build после любого изменений, чтобы сборщик работал с пустой папкой
gulp.task('clean', async function () {
  return del('build');
});
// 9 - запускаем процесс сборки в необходимой последовательности
gulp.task('build', gulp.series('clean', 'copy', 'copy-fonts', 'copy-img', 'style', 'images'));




