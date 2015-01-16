"use strict";

var debug = require("debug")("user-data");

var user = {
    create: function (user) {
        debug("Creating user:", user);
    },

    findByUsername: function (username) {
        debug("Finding user by username:", username);
    },

    findById: function (id) {
        debug("Finding user by id:", id);
    },

    findByEmail: function (email) {
        debug("Finding user by email:", email);
    }
};

module.exports = user;
