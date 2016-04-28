# gulp-eval

Require CommonJS modules, JSON files or files with JS-expression inside gulp tasks with ease.

[![NPM version](http://img.shields.io/npm/v/gulp-eval.svg?style=flat)](http://www.npmjs.org/package/gulp-eval)
[![Build Status](http://img.shields.io/travis/gulp-bem/gulp-eval/master.svg?style=flat&label=tests)](https://travis-ci.org/gulp-bem/gulp-eval)
[![Coverage Status](https://img.shields.io/coveralls/gulp-bem/gulp-eval.svg?branch=master&style=flat)](https://coveralls.io/r/gulp-bem/gulp-eval)
[![Dependency Status](http://img.shields.io/david/gulp-bem/gulp-eval.svg?style=flat)](https://david-dm.org/gulp-bem/gulp-eval)

`gulp-eval` fills `data` property of [Vinyl](https://github.com/gulpjs/vinyl) objects.

## Usage example:
```js
var gulp = require('gulp');
var concat = require('gulp-concat');
var gulpEval = require('gulp-eval');
var through = require('through2');

gulp.task('default', () =>
  gulp.src('node_modules/*/package.json')
    .pipe(gulpEval())
    .pipe(through.obj(function(file, enc, next) {
      var data = file.data; // Here we have evaluated package.json
      file.contents = new Buffer(data.name + '#' + data.version);
      next(null, file);
    }))
    .pipe(concat('packages.txt'))
    .pipe(gulp.dest('dest/'))
);
```

## Context
You can provide some like-a-global variables into gulp-eval

```js
var gulpEval = require('gulp-eval');
var globalVar = 42;
var transformStream = gulpEval({globalVar: globalVar});

// globalVar will be in context of evaluated code

```
