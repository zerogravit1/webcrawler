'use strict';

module.exports = function( grunt ) {
  grunt.initConfig( {
    eslint: {
      options: {
        config: '.eslintrc',
        quiet: true
      },
      src: ['src/**/*.js']
    },

    githooks: {
      all: {
        'pre-push': 'eslint'
      }
    }
  } );

  grunt.loadNpmTasks( 'grunt-githooks' );
  grunt.loadNpmTasks( 'grunt-contrib-eslint' );
  grunt.loadNpmTasks( 'gruntify-eslint' );
  grunt.registerTask( 'default', ['eslint'] );
};
