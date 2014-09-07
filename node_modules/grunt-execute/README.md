# grunt-execute 

[![Build Status](https://secure.travis-ci.org/Bartvds/grunt-execute.png?branch=master)](http://travis-ci.org/Bartvds/grunt-execute) [![Dependency Status](https://gemnasium.com/Bartvds/grunt-execute.png)](https://gemnasium.com/Bartvds/grunt-execute) [![NPM version](https://badge.fury.io/js/grunt-execute.png)](http://badge.fury.io/js/grunt-execute)

> Grunt plugin to execute code in node

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-execute --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-execute');
```

## The "execute" task

Execute javascript files and snippets to test application files, run loose bits development javascript or use basic files as a poor-mans grunt-tasks.

* Run selected files in a node.js child process.
* Run inline functions with grunt/options helpers and async support.
* Run functions before/after looping the selected files.
* Require() selected files as custom callback module.

The callback module file and inline functions all share the same signature with access to grunt, options and optional async callback.

### Overview

In your project's Gruntfile, add a section named `execute` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
	execute: {
		target: {
			src: ['script.js']
		}
	}
})
```

### Options

Also see the Gruntfile.js for real usage examples.

```js
grunt.initConfig({
	execute: {
		simple_target: {
			// execute javascript files in a node child_process
			src: ['script.js']
		},
		simple_target_with_args: {
			options: {
				// execute node with additional arguments
				args: ['arg1', 'arg2']
			},
			src: ['script.js']
		},
		simple_target_with_harmony: {
			options: {
				// pass arguments to node itself (eg: before script parameter)
				nodeargs: ['--harmony']
			},
			src: ['script.js']
		},
		cwd_target: {
			options: {
				// overide code cwd (defaults to '.' for project main)
				cwd: '.'
			},
			src: ['script.js']
		},
		glob_target: {
			// supports grunt glob and filter features
			src: ['apps/**/*.js', 'lib/**/index.js']
		},
		module_target: {
			options: {
				// use require() instead of a child_process
				// the scripts must be a module exporting a function
				// use a signature like the inline call-option (see below)

				module: true
			},
			src: ['script.js']
		},
		callback_sync: {
			// simple inline function call
			call: function(grunt, options){
				grunt.log.writeln('Hello!');
			}
		},
		callback_async: {
			// function call also supports async callback
			call: function(grunt, options, async){
				// get the callback
				var done = async();
				
				setTimeout(function(){
					grunt.log.writeln('Done!')
					done(err);
				}, 1000);
			}
		}
		before_after: {
			options: {
				// like call but executed before/after looping the files
				before: function(grunt, options){
					console.log('Hello!');
				},
				after: function(grunt, options){
					console.log('Bye!');
				}
			},
			// can also be used outside the options
			before: function(grunt, options){
				console.log('Hello!');
			},
			after: function(grunt, options){
				console.log('Bye!');
			}
			src: ['script.js'],
		},
	}
});
```


## Versions

* 0.2.2 - Add support for node arguments, via `nodeargs` (like `--harmony`)
* 0.2.1 - Non-zero exit code will fail grunt, add support for commandline arguments
* 0.1.5 - Added callback module & inline function support
* 0.1.4 - Ditched stdio option, show errors inline (even in webstorm)
* 0.1.3 - Basic version, colors disabled

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
