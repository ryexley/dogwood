"use strict";

var _ = require("lodash");

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
    }

});

module.exports = User;
