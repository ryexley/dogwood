"use strict";

var debug = require("debug")("dogwood:data:user");
var db = require("massive");
var cnx = require("../config").connectionString();

var user = {
    connect: function (next) {
        debug("Connection string:", cnx);
        db.connect(cnx, function (err, db) {
            if (next) {
                next(err, db);
            }
        });
    },

    create: function (user, next) {
        this.connect(function (err, db) {
            db.users.insert(user).execute(function (err, user) {
                if (next) {
                    next(err, user);
                }
            });
        });
    },

    update: function (data, id, next) {
        this.connect(function (err, db) {
            db.users.update(data, id).execute(function (err, result) {
                if (next) {
                    next(err, result);
                }
            });
        });
    },

    find: function (options, next) {
        options = options || {};

        this.connect(function (err, db) {
            db.users.find(options).execute(function (err, users) {
                if (next) {
                    next(err, users);
                }
            });
        });
    },

    findByUsername: function (username, next) {
        this.find({ username: username }, next);
    },

    findById: function (id, next) {
        this.find({ id: id }, next);
    },

    findByEmail: function (email, next) {
        this.find({ email: email }, next);
    }
};

module.exports = user;
