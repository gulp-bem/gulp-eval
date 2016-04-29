var through = require('through2');
var safeEval = require('node-eval');

module.exports = function(context) {
    return through.obj(function(file, enc, next) {
        var fileContent = file.contents.toString(enc);
        file.data = safeEval(fileContent, file.path, context);
        next(null, file);
    });
};
