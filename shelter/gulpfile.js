'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const merge = require('merge-stream');
const ccscomb = require('gulp-csscomb');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const minify = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const del = require('del');
const server = require('browser-sync').create();
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const babel = require('gulp-babel');

const pages = ['main', 'pets'];

gulp.task('styles', () => {
    return merge(
        pages.map((page) =>
            gulp
                .src(`source/pages/${page}/s[ac]ss/style.s[ac]ss`) // откуда берем файлы
                .pipe(plumber())
                .pipe(sass())
                .pipe(
                    postcss([
                        autoprefixer({
                            overrideBrowserlist: ['last 15 version', '> 1%', 'ie 8', 'ie 7'],
                        }),
                        mqpacker({
                            sort: true,
                        }),
                    ]),
                )
                .pipe(ccscomb())
                .pipe(gulp.dest(`source/pages/${page}`))
                .pipe(minify())
                .pipe(rename('style.min.css'))
                .pipe(gulp.dest(`build/pages/${page}`))
                .pipe(server.stream()),
        ),
    );
});

gulp.task('optimizeImgs', async function () {
    return gulp
        .src('build/assets/images/**/*.{png,jpg,gif,svg}')
        .pipe(
            imagemin([
                imagemin.gifsicle({
                    interlaced: true,
                }),
                imagemin.mozjpeg({
                    quality: 75,
                    progressive: true,
                }),
                imagemin.optipng({
                    optimizationLevel: 5,
                }),
                imagemin.svgo({
                    plugins: [
                        {
                            removeViewBox: true,
                        },
                        {
                            cleanupIDs: false,
                        },
                    ],
                }),
            ]),
        )
        .pipe(gulp.dest('build/assets/images')); // помещаем в эту же папку
});

gulp.task('serve', async function () {
    server.init({
        server: 'build',
        notify: false,
        open: true,
        cors: true,
        ui: false,
    });
    gulp.watch('source/pages/**/**/**/*.s[ac]ss', gulp.parallel('styles'));
    gulp.watch('source/pages/**/s[ac]ss/**/*.s[ac]ss', gulp.parallel('styles'));
    gulp.watch("source/js/**/*.js", gulp.series('clean', 'copy-html','copyIndex', 'copy-fonts', 'copy-img', 'copy-libs', 'styles', 'copy-js', 'copy-data', 'optimizeImgs')).on('change', server.reload);
    gulp.watch('source/pages/**/*.html', gulp.parallel('copy-html')).on('change', server.reload);
    gulp
        .watch(
            'source/assets/images/**/*.{png,jpg,gif,svg}',
            gulp.series('clean', 'copy-html', 'copyIndex', 'copy-fonts', 'copy-img', 'copy-libs', 'copy-js', 'styles', 'optimizeImgs'),
        )
        .on('change', server.reload);
});

gulp.task('copy-html', function async() {
    return merge(
        pages.map((page) =>
            gulp
                .src([`source/pages/${page}/*html`, `source/pages/${page}/normalize.css`], { allowEmpty: true })
                .pipe(gulp.dest(`build/pages/${page}`)),
        ),
    );
});

gulp.task('copyIndex', async function () {
    return gulp.src([
        'source/*html',
        `source/favicon.png`
    ])
        .pipe(gulp.dest('build'));
});

gulp.task('copy-fonts', function async() {
    return gulp.src(['source/assets/fonts/**/*.{woff,woff2,ttf}']).pipe(gulp.dest('build/assets/fonts'));
});

gulp.task('copy-img', function async() {
    return gulp.src(['source/assets/images/**/*.{png,jpg,gif,svg}']).pipe(gulp.dest('build/assets/images'));
});

gulp.task('copy-libs', function async() {
    return gulp.src('source/libs/**/*.*').pipe(gulp.dest('build/libs'));
});

gulp.task('copy-js', function async() {
    return gulp.src('source/js/*.js').pipe(gulp.dest('build/js'));
});

gulp.task('copy-data', function async() {
    return gulp.src('source/data/*.json').pipe(gulp.dest('build/data'));
});

// gulp.task("minjs", function () {
//     return gulp.src([
//         'source/js/nav.js',
//         'source/js/pop-up-main.js',
//         'source/js/render-pagination.js',
//         'source/js/swiper.js',
//         'source/js/render-main-slider.js',
//     ]) // Берем все необходимые js файлы(перечисляем их)
//         .pipe(babel({
//             presets: ["@babel/preset-env"]
//         }))
//         .pipe(concat("minjs.js")) // Собираем их в кучу в новом файле minjs.js
//         .pipe(uglify()) // Сжимаем JS файл
//         .pipe(gulp.dest("build/js")); // Выгружаем в папку build/libs
// });

gulp.task('clean', async function () {
    return del('build');
});

gulp.task('build', gulp.series('clean', 'copy-html','copyIndex', 'copy-fonts', 'copy-img', 'copy-libs', 'styles', 'copy-js', 'copy-data', 'optimizeImgs'));


