var gulp = require('gulp');
var rollup = require('rollup').rollup;
var gutil = require('gulp-util');

var rootDir = '.';
var srcDir = rootDir + '/src';
var distDir = rootDir + '/dist';

var rollupPlugins = [
    require('rollup-plugin-buble')()
];

gulp.task('scripts', [], function(cb) {
    var filename = 'youtube-api.js';
    var bundleOptions = { format: 'es' };
    if (gutil.env.uglify) {
        rollupPlugins.push(require('rollup-plugin-uglify')());
        bundleOptions.sourceMap = true;
        filename = 'youtube-api.min.js';
    }
    bundleOptions.dest = distDir + '/' + filename;
    rollup({
        entry: srcDir + '/youtube-api.js',
        plugins: rollupPlugins
    })
    .then(function(bundle) {
        bundle.write(bundleOptions);
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
