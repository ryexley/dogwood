"use strict";

var debug = require("debug")("model");
var util = require("../util");

var model = util.loadModuleFromDirectory({
    directory: __dirname,
    exclude: [__filename]
});

debug("Exporting model:", model);
module.exports = model;
