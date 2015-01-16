"use strict";

var debug = require("debug")("user-data");
var db = require("massive");

var user = {
    create: function (user) {
        debug("Creating user:", user);
        db.connect("postgres://ryexley@localhost/dogwood-dev", function (err, db) {
            db.users.insert({
                username: "ryexley",
                password: "foo",
                email: "bob@yexley.net",
                firstName: "Bob",
                lastName: "Yexley"
            }).execute(function (err, result) {
                if (err) {
                    debug("WOOPS! DIDN'T WORK!!", err);
                }

                debug("USER CREATED!", result);
            });
        });
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
