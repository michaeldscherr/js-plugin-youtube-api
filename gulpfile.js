function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    var temp = obj.constructor();
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }
    return temp;
}

var gulp = require('gulp');
var rollup = require('rollup').rollup;
var gutil = require('gulp-util');

var rootDir = '.';
var srcDir = rootDir + '/src';
var distDir = rootDir + '/dist';

var unminfiedOptions = {
    plugins: [require('rollup-plugin-buble')()],
    bundleOptions: {
        dest: distDir + '/youtube-api.js',
        format: 'es',
        sourceMap: true
    }
};
var minifiedOptions = cloneObject(unminfiedOptions);
minifiedOptions.bundleOptions.dest = distDir + '/youtube-api.min.js';
minifiedOptions.plugins.push(require('rollup-plugin-uglify')());

function bundleScript(options) {
    return new Promise((resolve, reject) => {
        rollup({
            entry: srcDir + '/youtube-api.js',
            plugins: options.plugins
        })
        .then(function(bundle) {
            bundle.write(options.bundleOptions);
            resolve();
        })
        .catch(function(error) {
            reject(error);
        });
    });
}

gulp.task('scripts', [], function(cb) {
    var promises = [
        bundleScript(unminfiedOptions),
        bundleScript(minifiedOptions)
    ];
    Promise.all(promises)
        .then(function() {
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
