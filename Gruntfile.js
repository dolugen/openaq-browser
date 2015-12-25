module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js: {
                src: [
                    'node_modules/jquery/dist/jquery.min.js',
                    'node_modules/angular/angular.min.js',
                    'node_modules/angular-route/angular-route.min.js',
                    'node_modules/angular-simple-logger/dist/angular-simple-logger.min.js',
                    'node_modules/angucomplete-alt/dist/angucomplete-alt.min.js',
                    'node_modules/bootstrap/dist/js/bootstrap.min.js',
                    'node_modules/c3/c3.min.js',
                    'node_modules/c3/node_modules/d3/d3.min.js',
                    'node_modules/ui-leaflet/node_modules/leaflet/dist/leaflet.js',
                    'node_modules/lodash/index.js',
                    'node_modules/ui-leaflet/dist/ui-leaflet.min.js',
                    'node_modules/urijs/src/URI.min.js'
                ],
                dest: 'dist/js/script.js'
            },
            css: {
                src: [
                    'node_modules/angucomplete-alt/angucomplete-alt.css',
                    'node_modules/bootstrap/dist/css/bootstrap.min.css',
                    'node_modules/c3/c3.min.css',
                    'node_modules/ui-leaflet/node_modules/leaflet/dist/leaflet.css'
                ],
                dest: 'dist/css/style.css'
            }
        },
        uglify: {
            all: {
                options: {
                    mangle: true,
                    compress: true
                },
                files: {
                    'dist/js/script.min.js': 'dist/js/script.js'
                }
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'node_modules/bootstrap/dist',
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

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', [
        'copy',
        'concat:js',
        'concat:css',
        'uglify'
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
