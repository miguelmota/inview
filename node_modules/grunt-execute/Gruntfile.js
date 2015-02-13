/*
 * grunt-execute
 * https://github.com/Bartvds/grunt-execute
 *
 * Copyright (c) 2013 Bart van der Schoor
 * Licensed under the MIT license.
 */

'use strict';

/*jshint -W098 */
module.exports = function (grunt) {
	// Project configuration.
	var help = require('./test/helper.js');
	var assert = require('assert');

	function getShellFail(name) {
		return {
			options: {
				callback: function (err, stdout, stderr, cb) {
					if (!err) {
						console.log('\nExpected error for test execute: '.red + 'execute:' + name + '\n');
						cb(new Error('expected task to fail'));
						return;
					}
					assert(/^Command failed: /.test(err.message), 'invalid error message: ' + err.message);
					cb();
				}
			},
			command: 'grunt execute:' + name
		};
	}

	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['tmp', 'test/tmp']
		},

		// Configuration to be run (and then tested).
		execute: {
			error: {src: ['test/fixtures/error.js']},
			error_module: {
				options: {
					module: true
				},
				src: ['test/fixtures/error.js']},
			node_sync: {
				src: ['test/fixtures/**/node.sync.*js']
			},
			node_async: {
				src: ['test/fixtures/node.async.js']
			},
			node_args: {
				options: {
					args: ['foo', 'bar']
				},
				src: ['test/fixtures/**/node.args.*js']
			},
			node_exit: {
				// will crash
				src: ['test/fixtures/node.exit.one.js']
			},
			zero: {
				src: ['test/fixtures/nonexisting.js']
			},
			module_sync: {
				options: {
					module: true
				},
				src: ['test/fixtures/module.sync.js']
			},
			module_async: {
				options: {
					module: true
				},
				src: ['test/fixtures/module.async.js']
			},
			harmony_on: {
				options: {
					nodeargs: ['--harmony']
				},
				src: ['test/fixtures/node.harmony.js']
			},
			call_sync: {
				call: function (grunt, options, async) {
					var ctx = help.getContext('call.sync.gruntfile.js');

					grunt.file.write(ctx.dest, ctx.data);
				}
			},
			call_async: {
				call: function (grunt, options, async) {
					var ctx = help.getContext('call.async.gruntfile.js');

					// callback get, makes grunt-execute run async
					var done = async();

					var fs = require('fs');
					setTimeout(function () {
						fs.writeFile(ctx.dest, ctx.data, function (err) {

							// call callback, passing error will fail the task
							done(err);
						});
					}, 500);
				}
			},
			beforeAfter: {
				options: {
					before: function (grunt, options, async) {
						var ctx = help.getContext('before.options.sync.gruntfile.js');

						grunt.file.write(ctx.dest, ctx.data);
					},
					after: function (grunt, options, async) {
						var ctx = help.getContext('after.options.sync.gruntfile.js');

						grunt.file.write(ctx.dest, ctx.data);
					}
				},
				before: function (grunt, options, async) {
					var ctx = help.getContext('before.sync.gruntfile.js');

					grunt.file.write(ctx.dest, ctx.data);
				},
				after: function (grunt, options, async) {
					var ctx = help.getContext('after.sync.gruntfile.js');

					grunt.file.write(ctx.dest, ctx.data);
				},
				src: ['test/fixtures/node.async.js']
			}
		},
		shell: {
			options: {
				stdout: false,
				stderr: false,
				execOptions: {
					cwd: '.'
				}
			},
			node_exit: getShellFail('node_exit:'),
			error: getShellFail('error'),
			error_module: getShellFail('error_module')
		},
		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js']
		}

	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('pass', [
		'execute:node_args',
		'execute:node_async',
		'execute:node_sync',
		'execute:harmony_on',
		'execute:zero',
		'execute:module_sync',
		'execute:module_async',
		'execute:call_sync',
		'execute:call_async',
		'execute:beforeAfter'
	]);
	grunt.registerTask('fail', [
		'shell:node_exit',
		'shell:error',
		'shell:error_module'
	]);

	grunt.registerTask('test', ['jshint', 'clean', 'pass', 'fail', 'nodeunit']);

	grunt.registerTask('default', ['test']);
	grunt.registerTask('dev', ['error']);

};
