module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("package.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			options: {
				banner: "<%= meta.banner %>"
			},
			js: {
				src: ["src/multislider.js"],
				dest: "dist/multislider.js"
			},
			css: {
				src: ["src/multislider.css"],
				dest: "dist/multislider.css"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/*.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/multislider.js"],
				dest: "dist/multislider.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				open: true,
				livereload: 35729,
				// Change this to '0.0.0.0' to access the server from outside
				hostname: '0.0.0.0'
			},
			livereload: {
				options: {
					middleware: function(connect) {
						return [
							connect.static('demo'),
							connect().use('/dist', connect.static('./src')),
						];
					}
				}
			}
		},

		watch: {
	    files: ['src/*', 'demo/*'],
	    tasks: ['jshint'],
	    options: {
	    	livereload: true
	    },
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'**/*.html',
					'**/*.css'
				]
			}
		},

		awsConfig: grunt.file.exists('aws-credentials.json')?grunt.file.readJSON('aws-credentials.json'):{'accessKeyId':'undefined'},

		s3: {
			options: {
				accessKeyId: "<%= awsConfig.accessKeyId %>",
				secretAccessKey: "<%= awsConfig.secretAccessKey %>",
				bucket: "components.rmalabs.com",
				region: "eu-west-1",
				access: "public-read",
				gzip: true
			},
			publish: {
				files: [{
			      src: "demo/index.html",
			      dest: "multi-slider/index.html"
			    },{
			      src: "dist/*",
			      dest: "multi-slider/"
			    }]
			}
		},

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-aws");


	grunt.registerTask("serve",['connect:livereload','watch']);
	grunt.registerTask("build", ["concat", "uglify"]);
	grunt.registerTask("default", ["jshint", "build"]);
	grunt.registerTask("travis", ["default"]);
	grunt.registerTask("deploy", ["build","s3:publish"]);

};
