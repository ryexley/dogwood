"use strict";

var debug = require("debug")("data");
var fs = require("fs");
var path = require("path");

var thisFile = __filename.substring(__filename.lastIndexOf("/") + 1, __filename.length);

var basename,
    data = {};

var dataFiles = fs.readdirSync(__dirname);
if (dataFiles.length) {
    dataFiles.forEach(function (file) {
        if (file !== thisFile) {
            basename = path.basename(file, path.extname(file));
            data[basename] = require(path.join(__dirname, file));
        }
    });
}

debug("Exporting data:", data);
module.exports = data;
