var stylus = require('stylus'),
    nib = require('nib')

exports.compile = function(str, path) {
    return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(nib())
}