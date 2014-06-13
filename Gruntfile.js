/* global module */

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['src/**/*.js'],
      gruntfile: ['Gruntfile.js']
    },
    includes: {
      app: {
        src: ['src/d3.4resch.js'],
        dest: 'tmp',
        flatten: true,
        cwd: '.'
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'sass',
          cssDir: 'styles',
          enviroment: 'production'
        }
      },
      dev: {
        options: {
          sassDir: 'sass',
          cssDir: 'styles'
        }
      }
    },
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
      },
      hint: {
        files: ['index.html', 'src/**/*.js', 'styles/**/*.css', 'data/**/*.{json,tsv,csv,xml}'],
        tasks: ['jshint']
      },
      include: {
        files: ['src/**/*.js'],
        tasks: ['includes:app']
      },
      compass: {
        files: ['sass/**/*.{sass,scss}'],
        tasks: ['compass:dev']
      },
      options: {
        livereload: true,
      }
    },
    connect: {
      server: {
        options: {
          port: 9000,
        }
      }
    },
 });

  // load modules
  grunt.loadNpmTasks('grunt-includes');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');

  // tasks register
  grunt.registerTask('default', ['jshint', 'includes:app', 'compass:dev', 'connect', 'watch']);
};
