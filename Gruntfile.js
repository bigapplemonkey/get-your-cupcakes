module.exports = function(grunt) {
    // Load the Grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Project configuration.
    grunt.initConfig({
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'css/styles.min.css': ['css/styles.css']
                }
            }
        },
        uglify: {
            my_target: {
                files: {
                    'js/map.min.js': ['js/map.js'],
                    'js/model.min.js': ['js/model.js'],
                    'js/viewModel.min.js': ['js/viewModel.js'],
                    'js/view.min.js': ['js/view.js']
                }
            }
        }
    });

    // Register the default tasks.
    grunt.registerTask('default', ['cssmin', 'uglify']);
}
