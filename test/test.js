var expect = require('chai').expect;
var gulpUtil = require('gulp-util');

var gulpEval = require('../');

var moduleContent =
`module.exports = {
    block: 'page',
    content: 'hello'
}`;

var evalContent =
`({
    block: 'page',
    content: 'hello'
})`;

it('should eval simple expression', function(done) {
    var stream = gulpEval();

    stream.on('data', function(file) {
        expect(file.data).to.exist;
    })
    .on('end', done);

    stream.write(new gulpUtil.File({
        path: 'file.js',
        contents: new Buffer('({})')
    }));

    stream.end();
});

it('should not eval simple object', function(done) {
    var stream = gulpEval();

    stream.on('data', function(file) {
        expect(file.data).not.to.exist;
    });
    stream.on('end', done);

    stream.write(new gulpUtil.File({
        path: 'file.js',
        contents: new Buffer('{}')
    }));

    stream.end();
});

it('should eval module', function(done) {
    var stream = gulpEval();

    stream.on('data', function(file) {
        expect(file.data.block).to.equal('page');
    });
    stream.on('end', done);

    stream.write(new gulpUtil.File({
        path: 'file.js',
        contents: new Buffer(moduleContent)
    }));

    stream.end();
});

it('should eval object', function(done) {
    var stream = gulpEval();

    stream.on('data', function(file) {
        expect(file.data.block).to.equal('page');
    });
    stream.on('end', done);

    stream.write(new gulpUtil.File({
        path: 'file.js',
        contents: new Buffer(evalContent)
    }));

    stream.end();
});

var globalObjectsContent = `module.exports = typeof console === 'object'`;

it('should provide global objects', function(done) {
    var stream = gulpEval({console});

    stream.on('data', function(file) {
        expect(file.data).to.be.true;
    });
    stream.on('end', done);

    stream.write(new gulpUtil.File({
        path: 'file.js',
        contents: new Buffer(globalObjectsContent)
    }));

    stream.end();
});

// TODO: Catch errors;
// var errorContent = `throw new Error('wtf')`;
