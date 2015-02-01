"use strict";

var _ = require("lodash");
var fs = require("fs");
var path = require("path");
var debug = require("debug")("config");

var env = process.env.NODE_ENV || "dev";

debug("ENV!!", env);

var defaultConfig = {};
var envConfig = {};

var defaultConfigPath = path.join(__dirname, "config.json");
var envConfigPath = path.join(__dirname, env + ".config.json");

if (fs.existsSync(defaultConfigPath)) {
    defaultConfig = require(defaultConfigPath);
}

if (fs.existsSync(envConfigPath)) {
    envConfig = require(envConfigPath);
}

var configData = _.extend({}, defaultConfig, envConfig);

var config = require("configya")(configData);

_.extend(config, {
    connectionString: function () {
        var connectionString = "",
            connectionStringTemplate = "postgres://{user}@{host}/{database}";

        // set lodash template interpolation
        _.templateSettings.interpolate = /{([\s\S]+?)}/g;

        if (this.postgres) {
            connectionString = _.template(connectionStringTemplate, this.postgres);
        }

        return connectionString;
    }
});

module.exports = config;
