module.exports = function ( grunt ) {
	'use strict';

	var paths = {
		app : 'wp-content/themes/twentyseventeen',
		dist : 'dist/guldbaggen-theme'
	};

	grunt.initConfig( {
		paths : paths,
		cssmin : {
			options : {
				report : 'min'
			},
			minify : {
				expand : true,
				cwd : '<%= paths.app %>/css/',
				src : 'style.css',
				dest : '<%= paths.dist %>/css/'
			}
		},
		clean : {
			main : {
				src : [
					'!.git/',
					'<%= paths.dist %>/*'
				]
			},
			after : ['.tmp']
		},
		copy : {
			main : {
				files : [
					{
						expand : true,
						cwd : '<%= paths.app %>',
						src : [
							'img/**/*',
							'style.css',
							'custom-editor-style.css',
							'*.php',
							'screenshot.png',
						    'assets/**/*',
						    'firebase_php/**/*',
						    'lib/**/*',
						    'vendor/**/*',
							'js/guldbaggen.js',
							'js/libs/modernizr.custom.js'
						],
						dest : '<%= paths.dist %>'
					},
					{
						expand: true,
						cwd: 'dev',
						src : [
							'plugins/**/*'
						],
						dest : 'dist/'
					}
				]
			}
		},
		shell : {
			main : {
				options : {
					stdout : true,
					callback : function ( err, stdout, stderr, cb ) {
						if ( stderr ) {
							console.log( stdout );
							cb( err );
						}
						cb();
					}
				},
				command : function ( arg ) {
					return 'sh ./deploy.sh "' + arg + '"';
				}
			},
			init : {
				options : {
					stdout : true
				},
				command : function ( arg ) {
					var command = 'sh ./deploy-init.sh "' + arguments[0] + ':' + arguments[1] + '"';
					return command;
				}
			},
			deploy : {
				options : {
					stdout : true
				},
				command : function( arg ){
					var commands = [
						'rsync -avz --exclude=.git dist/ root@109.74.8.165:/var/www/guldbaggen_2017/dist/',
						'rsync -avz --exclude=.git dev/gb-test-fd5bf-firebase-adminsdk-562dt-cf36badb79.json root@109.74.8.165:/var/www/guldbaggen_2017/dist/',
						'rsync -avz --exclude=.git dev/firebase-guldbaggen-firebase-adminsdk-998jk-8059ae5245.json root@109.74.8.165:/var/www/guldbaggen_2017/dist/'
					]
					return commands.join(';');
				}
			}
		},

		useminPrepare : {
			html : '<%= paths.app %>/footer.php'
		},

		usemin : {
			html : '<%= paths.dist %>/footer.php'
		},

		uglify : {
			main:{
				files : {
					'<%= paths.dist %>/js/main.js': [
						'<%= paths.app %>/js/**/*.js',
						'!<%= paths.app %>/js/guldbaggen.js',
						'!<%= paths.app %>/js/libs/firebase.js',
						'!<%= paths.app %>/js/libs/modernizr.custom.js'
					],
					'<%= paths.dist %>/js/plugins.js': [
						'<%= paths.app %>/bower_components/jquery/jquery.js',
						'<%= paths.app %>/bower_components/angular/angular.js',
						'<%= paths.app %>/bower_components/angular-resource/angular-resource.js',
						'<%= paths.app %>/bower_components/angular-sanitize/angular-sanitize.js',
						'<%= paths.app %>/bower_components/angular-touch/angular-touch.js',
						'<%= paths.app %>/bower_components/firebase/firebase.js',
						'<%= paths.app %>/bower_components/angularfire/dist/angularfire.js',
						'<%= paths.app %>/bower_components/greensock/src/uncompressed/TweenMax.js',
					]
				}
			}
		},

		less: {
			main: {
				files: {
					'<%= paths.app %>/css/style.css': '<%= paths.app %>/less/style.less'
				}
			}
		},

		watch : {
			main: {
				files: ['<%= paths.app %>/less/**/*.less'],
				tasks: ['less']
			}
		}



	} );

	grunt.loadNpmTasks( 'grunt-shell' );

	grunt.registerTask( 'default', [ 'clean:main', 'uglify', 'cssmin:minify', 'copy:main', 'usemin'] );

	grunt.registerTask( 'deploy', 'Deploy current version to server', function ( arg ) {
		arg = (typeof arg != 'undefined') ? arg : '';
		grunt.task.run( 'shell:main:' + arg );
	} );

	grunt.registerTask( 'init-deploy', function () {
		if ( !arguments[0] ) {
			console.error( '\n\nError: please provide path to remote repo. ( \'grunt:init-deploy:https://path.com/to/repo.git)\' ) \n\n' );
			return false;
		}
		else {
			grunt.task.run( 'shell:init:' + arguments[0] + ':' + arguments[1] );
		}

	} );
};