module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: {
          except: ['jQuery', 'Backbone']
        }
      },
      build: {
        src: 'src/js/*.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jasmine: {
      pivotal: {
        src: 'src/**/*.js',
        options: {
          specs: 'spec/*Spec.js',
          helpers: 'spec/*Helper.js',
          vendor: ['http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js',
          'js/underscore.js',
          'js/backbone.js']
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

  // Jasmine
  grunt.loadNpmTasks('grunt-contrib-jasmine');

};