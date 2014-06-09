module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['scripts/**/*.js'],
      gruntfile: ['Gruntfile.js']
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
      src: {
        files: ['index.html', 'scripts/**/*.js', 'styles/**/*.css', 'data/**/*.{.json,.tsv,.csv,.xml}'],
        tasks: ['jshint']
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
    livereload: {
    }
  });

  // load modules
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');

  // tasks register
  grunt.registerTask('default', ['jshint', 'compass:dev', 'connect', 'watch']);
};
