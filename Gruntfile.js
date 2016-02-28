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
                    'node_modules/c3/node_modules/d3/d3.min.js',
                    'node_modules/leaflet/dist/leaflet.js',
                    'node_modules/lodash/index.js',
                    'node_modules/ui-leaflet/dist/ui-leaflet.min.js',
                    'node_modules/urijs/src/URI.min.js'
                ],
                dest: 'dist/deps.js'
            },
            css: {
                src: [
                    'node_modules/angucomplete-alt/angucomplete-alt.css',
                    'node_modules/bootstrap/dist/css/bootstrap.min.css',
                    'node_modules/c3/c3.min.css',
                    'node_modules/leaflet/dist/leaflet.css'
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
                    "src/app/endpoints/endpoints.module.js",
                    "src/app/endpoints/endpoints.route.js",
                    "src/app/endpoints/cities.js",
                    "src/app/endpoints/cities-table.directive.js",
                    "src/app/endpoints/cities-form.directive.js",
                    "src/app/endpoints/countries.js",
                    "src/app/endpoints/countries.directive.js",
                    "src/app/endpoints/latest.js",
                    "src/app/endpoints/latest-table.directive.js",
                    "src/app/endpoints/latest-form.directive.js",
                    "src/app/endpoints/locations.js",
                    "src/app/endpoints/locations-table.directive.js",
                    "src/app/endpoints/locations-form.directive.js",
                    "src/app/endpoints/measurements.js",
                    "src/app/endpoints/measurements-form.directive.js",
                    "src/app/endpoints/measurements-table.directive.js",
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
            scripts: {
                files: ['src/**/*.js', 'src/**/*.html'],
                tasks: ['build'],
                options: {
                    spawn: false,
                    interval: 1000
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-processhtml');

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

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

};
