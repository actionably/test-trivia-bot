'use strict';

module.exports = function(grunt) {
  const watchFiles = {
    serverJS: ['gruntfile.js', 'src/**/*.js']
  };
  const env = grunt.file.readJSON('.env');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      serverJS: {
        files: watchFiles.serverJS,
        tasks: ['jshint', 'jscs'],
        options: {
          livereload: false
        }
      }
    },
    jscs: {
      src: watchFiles.serverJS,
      options: {
        config: '.jscsrc'
      }
    },
    jshint: {
      all: {
        src: watchFiles.serverJS,
        options: {
          jshintrc: true
        }
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['stage-3']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.js'],
          dest: 'build/',
          ext: '.js'
        }]
      }
    },
    nodemon: {
      devWebserver: {
        script: 'src/webserver.js',
        options: {
          env: env,
          ext: 'js,html',
          watch: 'src/**/*.js',
          exec: './node_modules/.bin/babel-node --presets stage-3 --es_staging --harmony_proxies --debug=5858'
        }
      }
    },
    concurrent: {
      default: ['nodemon:devWebserver', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt);

  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'jscs', 'concurrent:default']);
};
