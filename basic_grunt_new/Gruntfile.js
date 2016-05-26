module.exports = function (grunt) {

    // load all grunttasks
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        availabletasks: {
            tasks: {
                options: {
                    filter: 'include',
                    tasks: ['default', 'production']
                }
            }
        },

        sass: {                                                                             // Task
            dev: {                                                                          // Target
                options: {                                                                  // Target options
                    style: 'expanded'
                },
                files: {                                                                    // Dictionary of files
                    'src/dev/stylesheets/styles.css': 'src/dev/stylesheets/styles.scss',    // 'destination': 'source'
                }
            },
            production: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'src/assets/stylesheets/styles.css': 'src/dev/stylesheets/styles-prod.scss'
                }
            }
        },

        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 3 versions', 'IE 9']
                    })
                ]
            },
            dev: {
                options: {
                    map: true
                },
                dest: 'src/dev/stylesheets/styles.css',
                src: 'src/dev/stylesheets/styles.css'
            },
            production: {
                options: {
                    map: false
                },
                dest: 'src/assets/stylesheets/styles.css',
                src: 'src/assets/stylesheets/styles.css'
            }
        },

        cssmin: { // Begin CSS Minify Plugin
            options: {
                debug: true,
                keepSpecialComments: 0
            },
            normal: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/stylesheets/',
                    src: 'styles.css',
                    dest: 'src/assets/stylesheets/',
                    ext: '.min.css'
                }]
            },
            splitted: {                                                                     //splitting css for IE9
                files: [{
                    cwd: 'src/assets/stylesheets/',
                    dest: 'src/assets/stylesheets/',
                    expand: true,
                    ext: '.splitted.min.css',
                    src: 'styles.splitted.css'
                }]
            }
        },

        bless: {                                                                            //splitting css for IE9
            dev: {
                options: {
                    cacheBuster: false
                },
                files: {
                    'src/dev/stylesheets/styles.splitted.css': 'src/dev/stylesheets/styles.css'
                }
            },
            production: {
                options: {
                    cacheBuster: false
                },
                files: {
                    'src/assets/stylesheets/styles.splitted.css': 'src/assets/stylesheets/styles.css'
                }
            }
        },

        imagemin: {
            dev: {
                files: [{
                    cwd: 'src/dev/img/',
                    dest: 'src/assets/img/',
                    expand: true,
                    src: ['*.{png,jpg,gif}']
                }]
            }
        },

        svgmin: {
            options: {
                plugins: [
                    {
                        removeViewBox: false
                    }, {
                        removeUselessStrokeAndFill: false
                    }
                ]
            },
            dev: {
                files: [{
                    cwd: 'src/dev/img/',
                    dest: 'src/assets/img/',
                    expand: true,
                    src: ['*.svg']
                }]
            }
        },

        jshint: {
            options: {
                force: true,
                reporter: require('jshint-stylish')
            },
            dev: ['Gruntfile.js', 'src/dev/js/*.js', '!src/dev/js/*.min.js']
        },

        uglify: {
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    'src/dev/js/concat.min.js': ['src/dev/js/*.js', '!src/dev/js/*.min.js']
                }
            }
        },

        concat: {
            dev: {
                options: {
                    sourceMap: true
                },
                dest: 'src/assets/js/scripts.min.js',
                src:  [
                    'src/dev/js/concat.min.js'
                ]
            },
        },

        watch: {
            css: {
                options: {
                    spawn: false
                },
                files: ['src/dev/stylesheets/**/*.scss'],
                tasks: ['sass:dev','postcss:dev','bless:dev']
            },
            scripts: {
                files: 'src/dev/js/*.js',
                tasks: ['uglify:dev', 'concat:dev', 'jshint']
            },
            grunt: {
                files: 'Gruntfile.js',
                tasks: ['jshint']
            },
            image: {
                files: ['src/dev/img/*.png', 'src/dev/img/*.jpg', 'src/dev/img/*.gif', 'src/dev/img/*.svg'],
                tasks: ['newer:imagemin:dev', 'newer:svgmin:dev']
            },
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        '**/*.html',
                        'src/dev/stylesheets/**/*.css'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "./"
                    }
                }
            }
        }
    });

    // define default 'grunt' task
    grunt.registerTask('default', ['browserSync:dev', 'watch']);

    // Build asset files for production
    grunt.registerTask('production', [
            'sass:production',
            'newer:postcss:production',
            'newer:bless:production',
            'newer:cssmin:normal',
            'newer:cssmin:splitted',
            'newer:imagemin:dev',
        ]
    );
};
