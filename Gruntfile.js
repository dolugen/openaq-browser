module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower_concat: {
            all: {
                dest: 'dist/js/bower.js',
                cssDest: 'dist/css/bower.css',
                mainFiles: {
                    'jQuery': ['dist/jquery.min.js'],
                    'angular': ['angular.min.js'],
                    'angular-route': ['angular-route.min.js'],
                    'angular-simple-logger': ['dist/angular-simple-logger.min.js'],
                    'angucomplete-alt': [
                        'dist/angucomplete-alt.min.js',
                        'angucomplete-alt.css',
                    ],
                    'bootstrap': [
                        'dist/fonts/*',
                        'dist/css/bootstrap.min.css',
                        'dist/js/bootstrap.min.js'
                    ],
                    'c3': [
                        'c3.min.js',
                        'c3.min.css'
                    ],
                    'leaflet': [
                        'dist/leaflet.css',
                        'dist/leaflet.js'
                    ],
                    'lodash': ['lodash.min.js'],
                    'ui-leaflet': ['dist/ui-leaflet.min.js'],
                    'urijs': ['src/URI.min.js'],
                },
                bowerOptions: {
                    relative: false
                }
            }
        },
        uglify: {
            bower: {
                options: {
                    mangle: true,
                    compress: true
                },
                files: {
                    'dist/js/bower.min.js': 'dist/js/bower.js'
                }
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'bower_components/bootstrap/dist',
                    src: ['fonts/*.*'],
                    dest: 'dist'
                },{
                    expand: true,
                    cwd: 'src',
                    src: ['**'],
                    dest: 'dist'
                }]
            }
        },
        'gh-pages': {
            options: {
                base: 'dist',
                message: '[grunt] Update gh-pages.'
            },
            src: ['**']
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

    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', [
        'copy',
        'bower_concat',
        'uglify:bower'
    ]);
    grunt.registerTask('deploy', [
        'build',
        'gh-pages'
    ]);
    grunt.registerTask('default', ['build'])

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

};
