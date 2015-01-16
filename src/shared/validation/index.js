"use strict";

var debug = require("debug")("validation");
var util = require("../util");

var validation = util.loadModuleFromDirectory({
    directory: __dirname,
    exclude: [__filename]
});

debug("Exporting validators:", validation);
module.exports = validation;
