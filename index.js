var through = require('through2');
var vm = require('vm');

module.exports = function(context) {
	return through.obj(function(file, enc, next) {
		var fileContent = file.contents.toString(enc);
		fileContent = _eval(fileContent, file.relative, context);
		file.contents = new Buffer(fileContent);
		next(null, file);
	});
};

function _eval(content, filename, context) {
    var sandbox = {};

    sandbox.module = new Module(filename, module.parent);
    sandbox.exports = sandbox.module.exports;
    sandbox.require = sandbox.module.require;
	Object.assign(sandbox, context);

    return vm.runInNewContext(content, sandbox, {filename: filename});
}
