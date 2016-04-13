var expect = require('chai').expect;
var gulpUtil = require('gulp-util');

var gulpEval = require('../');

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

var moduleContent =
`module.exports = {
    block: 'page',
    content: 'hello'
}`;

it('should eval module.exports', function(done) {
    var stream = gulpEval();

    stream.on('data', function(file) {
        expect(file.data.block).to.equal('page');
    });
    stream.on('end', done);

    stream.write(new gulpUtil.File({
        path: 'blocks/button.js',
        contents: new Buffer(moduleContent)
    }));

    stream.end();
});

var exportsContent =
`exports = {
    block: 'page',
    content: 'hello'
}`;

it('should eval module', function(done) {
    var stream = gulpEval();

    stream.on('data', function(file) {
        expect(file.data.block).to.equal('page');
    });
    stream.on('end', done);

    stream.write(new gulpUtil.File({
        path: 'blocks/button.js',
        contents: new Buffer(exportsContent)
    }));

    stream.end();
});

var moduleExportsContent =
`exports = module.exports = {
    block: 'page',
    content: 'hello'
}`;

it('should eval exports = module.exports', function(done) {
    var stream = gulpEval();

    stream.on('data', function(file) {
        expect(file.data.block).to.equal('page');
    });
    stream.on('end', done);

    stream.write(new gulpUtil.File({
        path: 'blocks/button.js',
        contents: new Buffer(moduleExportsContent)
    }));

    stream.end();
});

var moduleExportsChangeField =
`exports.block = 'Fuck';
`;

it('should eval exports part', function(done) {
    var stream = gulpEval();

    stream.on('data', function(file) {
        expect(file.data.block).to.equal('Fuck');
    });
    stream.on('end', done);

    stream.write(new gulpUtil.File({
        path: 'blocks/button.js',
        contents: new Buffer(moduleExportsChangeField)
    }));

    stream.end();
});

var requireContent =
`
var p = require('../package.json');
module.exports = {
    block: p.name,
    content: 'hello'
}
`;

it('should eval module with require', function(done) {
    var stream = gulpEval();

    stream.on('data', function(file) {
        expect(file.data.block).to.equal('gulp-eval');
    });
    stream.on('end', done);

    stream.write(new gulpUtil.File({
        path: 'blocks/button.js',
        contents: new Buffer(requireContent)
    }));

    stream.end();
});

var evalContent =
`({
    block: 'page',
    content: 'hello'
})`;

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

it('should eval json', function(done) {
    var stream = gulpEval();

    stream.on('data', function(file) {
        expect(file.data.block).to.equal('page');
    });
    stream.on('end', done);

    stream.write(new gulpUtil.File({
        path: 'file.json',
        contents: new Buffer('{"block":"page"}')
    }));

    stream.end();
});

it('should throw on bad json', function() {
    var stream = gulpEval();
    expect(function() {
        stream.write(new gulpUtil.File({
            path: 'file.json',
            contents: new Buffer('{"block":"page",}')
        }));
    }).to.throw(Error);

    stream.end();
});

var globalObjectsContent = `module.exports = typeof boo === 'object'`;

it('should provide global objects', function(done) {
    var boo = {};
    var stream = gulpEval({boo});

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
