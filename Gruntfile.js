module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            node: {
                src: [
                    'node_modules/jquery/dist/jquery.min.js',
                    'node_modules/angular/angular.min.js',
                    'node_modules/angular-route/angular-route.min.js',
                    'node_modules/angular-simple-logger/dist/angular-simple-logger.min.js',
                    'node_modules/angucomplete-alt/dist/angucomplete-alt.min.js',
                    'node_modules/bootstrap/dist/js/bootstrap.min.js',
                    'node_modules/c3/c3.min.js',
                    'node_modules/d3/d3.min.js',
                    'node_modules/leaflet/dist/leaflet.js',
                    'node_modules/lodash/index.js',
                    'node_modules/moment/min/moment.min.js',
                    'node_modules/ui-leaflet/dist/ui-leaflet.min.js',
                    'node_modules/urijs/src/URI.min.js'
                ],
                dest: 'dist/deps.js',
                nonull: true
            },
            css: {
                src: [
                    'node_modules/angucomplete-alt/angucomplete-alt.css',
                    'node_modules/bootstrap/dist/css/bootstrap.min.css',
                    'node_modules/c3/c3.min.css',
                    'node_modules/leaflet/dist/leaflet.css',
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
                        cwd: 'node_modules/bootstrap/dist',
                        src: ['fonts/*.*'],
                        dest: 'dist'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: 'node_modules/bootstrap/dist/',
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
                    'dist/deps.min.js': 'dist/deps.js'
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
            tasks: ['build', 'karma:unit:run'],
            options: {
                spawn: false,
                interval: 1000
            }
        },
        browserSync: {
            bsFiles: {
                src: [
                    'Gruntfile.js',
                    'dist/*,',
                    'dist/app/**/*'
                ]
            },
            options: {
                logLevel: "silent",
                watchTask: true,
                server: {
                    baseDir: "./dist",
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
        'concat:node',
        'concat:js',
        'concat:css',
        'processhtml',
    ]);
    grunt.registerTask('deploy', [
        'build',
        'gh-pages'
    ]);
    grunt.registerTask('default', ['build']);

};
