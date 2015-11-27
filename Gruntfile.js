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
                    'bootstrap': [
                        'dist/fonts/*',
                        'dist/css/bootstrap.min.css',
                        'dist/js/bootstrap.min.js'
                    ],
                    'leaflet': [
                        'dist/leaflet.css',
                        'dist/leaflet.js'
                    ],
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
        }
    });

    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-gh-pages');

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

};
