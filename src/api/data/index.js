"use strict";

var debug = require("debug")("data");
var util = require("../util");

var data = util.loadModuleFromDirectory({
    directory: __dirname,
    exclude: [__filename]
});

debug("Exporting data:", data);
module.exports = data;
