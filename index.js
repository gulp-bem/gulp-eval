var through = require('through2');
var vm = require('vm');
var Module = require('module');

module.exports = function(context) {
	return through.obj(function(file, enc, next) {
		var fileContent = file.contents.toString(enc);
		file.data = _eval(fileContent, file.relative, context);
		next(null, file);
	});
};

function _eval(content, filename, context) {
    var sandbox = {};

    sandbox.module = new Module(filename, module.parent);
    sandbox.exports = sandbox.module.exports;
    sandbox.require = sandbox.module.require;
	Object.assign(sandbox, context);

    var res = vm.runInNewContext(content, sandbox, {filename: filename});
    return res || sandbox.module.exports;
}

module.exports.eval = _eval;
