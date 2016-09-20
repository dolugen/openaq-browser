module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            bower: {
                src: [
                    'src/bower_components/jquery/dist/jquery.min.js',
                    'src/bower_components/angular/angular.min.js',
                    'src/bower_components/angular-route/angular-route.min.js',
                    'src/bower_components/angular-simple-logger/dist/angular-simple-logger.min.js',
                    'src/bower_components/angucomplete-alt/dist/angucomplete-alt.min.js',
                    'src/bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'src/bower_components/c3/c3.min.js',
                    'src/bower_components/d3/d3.min.js',
                    'src/bower_components/leaflet/dist/leaflet.js',
                    'src/bower_components/lodash/lodash.min.js',
                    'src/bower_components/moment/min/moment.min.js',
                    'src/bower_components/ui-leaflet/dist/ui-leaflet.min.js',
                    'src/bower_components/urijs/src/URI.min.js'
                ],
                dest: 'dist/bower.js',
                nonull: true
            },
            css: {
                src: [
                    'src/bower_components/angucomplete-alt/angucomplete-alt.css',
                    'src/bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'src/bower_components/c3/c3.min.css',
                    'src/bower_components/leaflet/dist/leaflet.css',
                    'src/assets/css/style.css'
                ],
                dest: 'dist/css/style.css'
            },
            js: {
                src: [
                    "src/app/app.module.js",
                    "src/app/core/core.module.js",
                    "src/app/core/config.js",
                    "src/app/core/constants.js",
                    "src/app/core/exception.js",
                    "src/app/core/core.directives.js",
                    "src/app/core/url.service.js",
                    "src/app/core/data.service.js",
                    "src/app/core/storage.service.js",
                    "src/app/core/date.factory.js",
                    "src/app/core/nav.js",
                    "src/app/core/404.route.js",
                    "src/app/core/about.route.js",
                    "src/app/core/about.js",
                    "src/app/endpoints/endpoints.module.js",
                    "src/app/endpoints/endpoints.route.js",
                    "src/app/endpoints/cities.js",
                    "src/app/endpoints/cities-table.directive.js",
                    "src/app/endpoints/cities-form.directive.js",
                    "src/app/endpoints/countries.js",
                    "src/app/endpoints/countries.directive.js",
                    "src/app/endpoints/fetches.js",
                    "src/app/endpoints/fetches-form.directive.js",
                    "src/app/endpoints/fetches-table.directive.js",
                    "src/app/endpoints/geo-filters.directive.js",
                    "src/app/endpoints/latest.js",
                    "src/app/endpoints/latest-table.directive.js",
                    "src/app/endpoints/latest-form.directive.js",
                    "src/app/endpoints/locations.js",
                    "src/app/endpoints/locations-table.directive.js",
                    "src/app/endpoints/locations-form.directive.js",
                    "src/app/endpoints/measurements.js",
                    "src/app/endpoints/measurements-form.directive.js",
                    "src/app/endpoints/measurements-table.directive.js",
                    "src/app/endpoints/panel-main.directive.js",
                    "src/app/endpoints/parameters.js",
                    "src/app/endpoints/sources.js",
                    "src/app/graph/graph.module.js",
                    "src/app/graph/graph.route.js",
                    "src/app/graph/graph.js",
                ],
                dest: 'dist/app.js'
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: 'src/bower_components/bootstrap/dist',
                        src: ['fonts/*.*'],
                        dest: 'dist'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: 'src/bower_components/bootstrap/dist/',
                        src: ['css/bootstrap.min.css.map'],
                        dest: 'dist'
                    },
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['**'],
                        dest: 'dist'
                    }
                ]
            }
        },
        'gh-pages': {
            options: {
                base: 'dist',
                message: '[grunt] Update gh-pages.'
            },
            src: ['**']
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'src/app/**/*.js'
            ],
            options: {
                "curly": true,
                "eqnull": true,
                "eqeqeq": true,
                "undef": true,
                "strict": true,
                "node": true,
                "globals": {
                    "localStorage": true,
                    "angular": true,
                    "c3": false,
                    "_": false,
                    "moment": false,
                    "URI": false,
                    "$": false,
                    "module": false
                }
            }
        },
        processhtml: {
            options: {
                data: {
                    message: 'Hello world!'
                }
            },
            dist: {
                files: {
                    'dist/index.html': ['src/index.html']
                }
            }
        },
        uglify: {
            all: {
                options: {
                    mangle: true,
                    compress: true
                },
                files: {
                    'dist/bower.min.js': 'dist/bower.js',
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'dist/css/style.min.css': 'dist/css/style.css'
                }
            }  
        },
        watch: {
            files: [
                '*.js',
                'src/*',
                'src/app/*',
                'src/app/**/*',
                'src/assets/css/*',
                'test/*'
            ],
            tasks: ['karma:unit:run'],
            options: {
                spawn: false,
                interval: 1000
            }
        },
        browserSync: {
            bsFiles: {
                src: [
                    'Gruntfile.js',
                    'src/*',
                    'src/app/**/*'
                ]
            },
            options: {
                logLevel: "silent",
                watchTask: true,
                server: {
                    baseDir: "./src",
                    index: "index.html"
                }
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                background: true,
                singleRun: false
            },
            continuous: {
                configFile: 'test/karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.registerTask('serve', [
        'browserSync',
        'karma:unit:start',
        'watch'
    ]);

    grunt.registerTask('build', [
        'jshint',
        'copy',
        'concat',
        'uglify',
        'cssmin',
        'processhtml'
    ]);
    grunt.registerTask('deploy', [
        'build',
        'gh-pages'
    ]);
    grunt.registerTask('default', ['build']);

};
