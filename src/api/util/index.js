"use strict";

var debug = require("debug")("util");
var fs = require("fs");
var path = require("path");

var util = {
    loadModuleFromDirectory: function (options) {
        options = options || {};

        var target = {},
            files = [],
            filePath = "",
            excludeFile = false,
            basename = "";

        if (options.directory && options.directory.length) {
            files = fs.readdirSync(options.directory);
        }

        if (files.length) {
            files.forEach(function (file) {
                filePath = path.join(options.directory, file);
                excludeFile = (options.exclude && options.exclude.length && (options.exclude.indexOf(filePath) !== -1));

                if (!excludeFile) {
                    basename = path.basename(file, path.extname(file));
                    target[basename] = require(filePath);
                }
            });
        }

        debug("Loading module from directory:", target);
        return target;
    }
};

module.exports = util;
