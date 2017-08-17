// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-12-27 using
// generator-karma 1.0.1

module.exports = function(config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        // as well as any additional frameworks (requirejs/chai/sinon/...)
        frameworks: [
            "mocha", "chai"
        ],

        // reporters configuration 
        reporters: ['mocha'],

        // list of files / patterns to load in the browser
        files: [
            // bower:js
            'bower_components/angular/angular.js',
            'bower_components/angular-bootstrap/ui-bootstrap.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'bower_components/angular-loading-bar/build/loading-bar.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/ng-notify/src/scripts/ng-notify.js',
            'bower_components/themify-icons/ie7/ie7.js',
            'bower_components/angucomplete-alt/angucomplete-alt.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/tether/dist/js/tether.js',
            'bower_components/jquery.nicescroll/jquery.nicescroll.js',
            'bower_components/checklist-model/checklist-model.js',
            'bower_components/angular-prompt/dist/angular-prompt.js',
            'bower_components/lodash/lodash.js',
            'bower_components/ui-listView/dist/ui-listView.js',
            'bower_components/ngstorage/ngStorage.js',
            'bower_components/angular-jwt/dist/angular-jwt.js',
            'bower_components/ng-aa/dist/ng-aa.js',
            'bower_components/ng-csv/build/ng-csv.js',
            'bower_components/angular-elastic/elastic.js',
            'bower_components/ngToast/dist/ngToast.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/oi.select/dist/select-tpls.min.js',
            'bower_components/angular-mailto/angular-mailto.js',
            'bower_components/angular-color-picker/angular-color-picker.js',
            'bower_components/moment/moment.js',
            'bower_components/bootstrap-daterangepicker/daterangepicker.js',
            'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',
            'bower_components/angularPrint/angularPrint.js',
            'bower_components/echarts/dist/echarts.js',
            'bower_components/angular-echarts/dist/angular-echarts.js',
            'bower_components/angular-socket-io/socket.js',
            'bower_components/socket.io-client/dist/socket.io.js',
            'bower_components/ng-focus-if/focusIf.js',
            // endbower
            "app/scripts/**/*.js",
            "test/mock/**/*.js",
            "test/spec/**/*.js"
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            "PhantomJS"
        ],

        // Which plugins to enable
        plugins: [
            "karma-phantomjs-launcher",
            "karma-chai",
            "karma-mocha",
            "karma-mocha-reporter"
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};