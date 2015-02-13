/*
 * grunt-execute
 * https://github.com/Bartvds/grunt-execute
 *
 * Copyright (c) 2013 Bart van der Schoor
 * Licensed under the MIT license.
 */


module.exports = function (grunt) {
	'use strict';

	var path = require('path');

	function executeModuleFunction(func, context, callback) {
		// private
		var isFinalised = false;
		var isAsync = false;
		var funcDone = false;
		var calledDone = false;

		var finalise = function (err, msg) {
			if (isFinalised) {
				grunt.fail.warn('executeModuleFunction() detected async flow error');
				return null;
			}
			isFinalised = true;

			if (typeof msg !== 'undefined') {
				grunt.log.writeln(msg);
			}
			process.nextTick(function () {
				callback(err);
			});
		};

		var async = function () {
			if (funcDone) {
				grunt.fail.warn('executeModuleFunction() call async() in main body');
				return null;
			}
			if (isAsync) {
				grunt.fail.warn('executeModuleFunction() detected multiple calls to async()');
				return null;
			}
			isAsync = true;

			return function (err, msg) {
				if (calledDone) {
					grunt.fail.warn('executeModuleFunction() detected multiple calls to the async callback');
					return null;
				}
				calledDone = true;
				if (typeof msg !== 'undefined') {
					grunt.log.writeln(msg);
				}
				finalise(err, msg);
			};
		};
		var msg = func(grunt, context.options, async);

		funcDone = true;

		if (!isAsync && !calledDone) {
			finalise(null, msg);
		}
		else {
			if (typeof msg !== 'undefined') {
				grunt.log.writeln(msg);
			}
		}
	}

	function executeModule(func, context, callback) {

		grunt.log.writeln('-> '.cyan + 'module call ' + (func.name ? func.cyan : '<anonymous>'));

		var start = Date.now();
		executeModuleFunction(func, context, function (err) {
			if (err) {
				grunt.fail.warn('-> '.cyan + 'error '.red + '(' + (Date.now() - start) + 'ms)');
			} else {
				context.counter += 1;
				grunt.log.writeln('-> '.cyan + 'completed ' + '(' + (Date.now() - start) + 'ms)');
			}
			callback(err);
		});
	}

	function executeSrcAsModule(src, context, callback) {

		grunt.log.writeln('-> '.cyan + 'executing module ' + src.cyan);

		var mod;
		try {
			mod = require(src);
		}
		catch (err) {
			callback(new Error('not a function'));
			return;
		}

		if (!grunt.util._.isFunction(mod)) {
			grunt.fail.warn('-> '.cyan + 'error '.red + src.cyan + ' should export a Function');
			callback(new Error('not a function'));
			return;
		}
		var start = Date.now();
		executeModuleFunction(mod, context, function (err) {
			if (err) {
				grunt.fail.warn('-> '.cyan + 'error '.red + src.cyan + ' (' + (Date.now() - start) + 'ms)');
			} else {
				context.counter += 1;
				grunt.log.writeln('-> '.cyan + 'completed ' + src.cyan + ' (' + (Date.now() - start) + 'ms)');
			}
			callback(err);
		});
	}

	function executeSrcAsChild(src, context, callback) {

		grunt.log.writeln('-> '.cyan + 'executing ' + src.cyan);

		var start = Date.now();

		var args = context.options.args ? [src].concat(context.options.args) : [src];
		if (context.options.nodeargs) {
			args = context.options.nodeargs.concat(args);
		}

		//use spawn so we don't have to depend on process.exit();
		var child = grunt.util.spawn(
			{
				cmd: 'node',
				args: args,
				opts: {
					cwd: (context.options.cwd !== null) ? context.options.cwd : path.dirname(src)
				}
			},
			function (error, result, code) {
				if (error) {
					grunt.fail.warn('-> '.cyan + 'error '.red + ('' + code).red + ' ' + src.cyan + ' (' + (Date.now() - start) + 'ms)');
					callback(error);
				} else if (code !== 0) {
					grunt.fail.warn('-> '.cyan + 'exitcode '.red + ('' + code).red + ' ' + src.cyan + ' (' + (Date.now() - start) + 'ms)');
					callback(new Error('bad exit code ' + code), code);
				} else {
					context.counter += 1;
					grunt.log.writeln('-> '.cyan + 'completed ' + src.cyan + ' (' + (Date.now() - start) + 'ms)');
					callback();
				}
			}
		);
		child.stdout.on('data', function (data) {
			grunt.log.write(data);
		});
		child.stderr.on('data', function (data) {
			grunt.log.write(('' + data).red);
		});
	}

	function pluralise(count, str) {
		return count + ' ' + str + (count === 1 ? '' : 's');
	}

	grunt.registerMultiTask('execute', 'execute code in node', function () {

		var options = this.options({
			cwd: '.'
		});

		//var self = this;
		var done = this.async();
		var context = {
			timer: Date.now(),
			calls: 0,
			files: 0,
			counter: 0,
			options: options
		};

		var checkModuleFunc = function (func, callback) {
			if (func) {
				context.calls++;
				executeModule(func, context, callback);
			}
			else {
				callback();
			}
		};

		var self = this;

		grunt.util.async.series(
			[
				function (callback) {
					checkModuleFunc(options.before, callback);
				},
				function (callback) {
					checkModuleFunc(self.data.before, callback);
				},
				function (callback) {
					checkModuleFunc(self.data.call, callback);
				},
				function (callback) {
					grunt.util.async.forEachSeries(self.filesSrc,
						function (src, callback) {
							context.files++;

							src = path.resolve(src);
							if (!src) {
								grunt.fail.warn('undefined src parameter');
								return false;
							}
							if (!grunt.file.exists(src)) {
								grunt.fail.warn('file does not exist ' + src);
								return false;
							}

							if (options.module) {
								executeSrcAsModule(src, context, callback);
							}
							else {
								executeSrcAsChild(src, context, callback);
							}
						},
						callback, self);
				},
				function (callback) {
					checkModuleFunc(self.data.after, callback);
				},
				function (callback) {
					checkModuleFunc(options.after, callback);
				}
			],
			function (err) {
				grunt.log.writeln('');
				if (err) {
					grunt.log.writeln(err);
					done(false);
				}
				else {
					grunt.log.ok('' + pluralise(context.files, 'file') + ' and ' + pluralise(context.calls, 'call') + ' executed (' + (Date.now() - context.timer) + 'ms)\n');
					done();
				}
			}
		);
	});
};
