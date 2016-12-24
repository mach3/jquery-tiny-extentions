
module.exports = function(grunt){
	require("load-grunt-tasks")(grunt);

	var banner = grunt.template.process(
		grunt.file.read("./src/banner.js"),
		{
			data: grunt.file.readJSON("./package.json")
		}
	);

	grunt.initConfig({

		browserify: {
			options: {
				banner: banner
			},
			dist: {
				files: {
					"dist/extentions.js": "src/dist.js"
				}
			}
		},

		uglify: {
			options: {
				preserveComments: function(a, b){
					return (/license/i).test(b.value);
				}
			},
			dist: {
				files: {
					"dist/extentions.min.js": "dist/extentions.js"
				}
			}
		},

		watch: {
			js: {
				files: ["src/*.js"],
				tasks: ["browserify:dist"]
			},
			uglify: {
				files: ["dist/extentions.js"],
				tasks: ["uglify:dist"]
			}
		}

	});

	grunt.registerTask("build", ["browserify:dist", "uglify:dist"]);

};
