module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc : {
      dist : {
        src: [
          './inview.js',
          'README.md'
        ],
        jsdoc: './node_modules/.bin/jsdoc',
        options: {
          destination: './docs',
          configure: './config/conf.json',
          template: './node_modules/jsdoc-oblivion/template'
        }
      }
    },
    execute: {
      target: {
        src: ['clean.js']
      }
    }
  });
  grunt.registerTask('default', ['grunt-jsdoc']);
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-execute');
};
