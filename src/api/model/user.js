"use strict";

var _ = require("lodash");
// var async = require("async");
var debug = require("debug")("user");
var validate = require("validate.js");
var pw = require("credential");

var validationRules = require("../../shared/validation").users;
// var data = require("../data");

function User (options) {
    options = options || {};

    this.username = options.username;
    this.password = options.password;
    this.email = options.email || "";
    this.firstName = options.firstName || "";
    this.lastName = options.lastName || "";
    this.isActive = options.isActive || true;
    this.created = options.created || new Date(-8640000000000000);
    this.updated = options.updated || new Date(-8640000000000000);
}

_.extend(User, {

    create: function (data, next) {
        debug("CREATE: data:", data);
        var user,
            validationErrors = User.validate(data);

        if (validationErrors) {
            throw new Error("Invalid input", validationErrors);
        }

        user = new User(data);

        // async.series([
        //     function (next) { // verify username does not exist
        //
        //     },
        //     function (next) { // verify email does not exist
        //
        //     },
        //     function (next) { // hash password
        //
        //     },
        //     function (next) { // save to database
        //
        //     }
        // ], function (err, results) {
        //
        // });

        pw.hash(user.password, function (err, hash) {
            if (err) {
                throw err;
            }

            user.password = hash;

            debug("New user created:", user);

            if (next) {
                next(user);
            }
        });
    },

    login: function (username, password, next) {
        // TODO: implement some actual authentication logic here

        var user;

        if (username) {
            user = new User(username, password);
        }

        next(null, user);
    },

    findByUsername: function (username, next) {
        // TODO: implement some actual username lookup functionality here

        var user;

        if (username) {
            user = new User(username, "");
        }

        next(null, user);
    },

    validate: function (target) {
        return validate(target, validationRules);
    }

});

module.exports = User;
