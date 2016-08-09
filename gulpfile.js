var gulp = require('gulp');
var rollup = require('rollup').rollup;
var gutil = require('gulp-util');

var rootDir = '.';
var srcDir = rootDir + '/src';
var distDir = rootDir + '/dist';

var rollupPlugins = [
    require('rollup-plugin-buble')(),
    require('rollup-plugin-uglify')()
];

gulp.task('scripts', [], function(cb) {
    rollup({
        entry: srcDir + '/youtube-api.js',
        plugins: rollupPlugins
    })
    .then(function(bundle) {
        bundle.write({
            dest: distDir + '/youtube-api.min.js',
            format: 'es',
            sourceMap: true
        });
        cb();
    })
    .catch(function(error) {
        gutil.log(error.message);
        cb();
    });
});

gulp.task('watch', ['default'], function() {
    gulp.watch(srcDir + '/youtube-api.js', ['scripts']);
});

gulp.task('default', ['scripts']);
