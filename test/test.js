var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();// WTF chaiAsPromised !??

var gulpUtil = require('gulp-util');

var gulpEval = require('../');

function coco(content, context) {
    var promise =  new Promise(function(resolve, reject) {
        var stream = gulpEval(context);

        stream
            .on('data', (file) => resolve(file.data))
            .on('error', reject);

        if(typeof content === 'string') {
            content = {
                path: 'file.js',
                contents: new Buffer(content)
            };
        } else {
            content = {
                path: 'file.json',
                contents: new Buffer(JSON.stringify(content))
            };
        }

        stream.write(new gulpUtil.File(content)) || reject('Writing to stream failed');
        stream.end();
    });
    return promise.should.eventually;
}

it('should eval simple expression', () => coco('({42:42})').eql({42: 42}));

it('should not eval simple object', () => coco('{}').not.to.exist);

it('should eval module.exports', () => coco('module.exports = {42:42}').eql({42: 42}));

it('should eval exports', () => coco('exports.block = 42').eql({block: 42}));

it('should eval exports replace', () => coco('exports = {42:42}').eql({42: 42}));

it('should eval exports = module.exports', () => coco('exports = module.exports = {42:42}').eql({42: 42}));

it('should eval module with require', () => {
    var requireContent =
    `
        var p = require('../package.json');
        module.exports = {
            block: p.name,
        };
    `;
    coco(requireContent).eql({block: 'gulp-eval'});
});

it('should provide global objects', () => coco('module.exports = typeof chai === "object"', {chai}).to.be.true);

it('should eval json', () => coco({42: 42}).eql({42: 42}));

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

// TODO: Catch errors;
// var errorContent = `throw new Error('wtf')`;
