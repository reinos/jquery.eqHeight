"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        
        banner: "/*\n" +
                " * <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
                " * <%= pkg.description %>\n" +
                " * <%= pkg.homepage %>\n" +
                " *\n" +
                " * Made by <%= pkg.author.name %>\n" +
                " * Under <%= pkg.license %> License\n" +
                " */\n",
        
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: [
                "Gruntfile.js",
                "src/jquery.eqHeight.js"
            ]
        },
        concat: {
            plugin: {
                src: ["src/jquery.eqHeight.js"],
                dest: "dist/jquery.eqHeight.js"
            },
            options: {
                banner: "<%= banner %>"
            }
        },
        uglify: {
            plugin: {
                src: ["dist/jquery.eqHeight.js"],
                dest: "dist/jquery.eqHeight.min.js"
            },
            options: {
                banner: "<%= banner %>"
            }
        },
    });
    
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    
    grunt.registerTask("travis", ["jshint"]);
    grunt.registerTask("default", ["jshint", "concat", "uglify"]);
};