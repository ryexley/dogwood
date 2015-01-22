"use strict";

var _ = require("lodash");
var async = require("async");
var debug = require("debug")("user-model");
var validate = require("validate.js");
var pw = require("credential");

var validationRules = require("../../shared/validation").users;
var db = require("../data");

function User (options) {
    options = options || {};

    this.username = options.username;
    this.password = options.password;
    this.email = options.email || "";
    this.firstName = options.firstName || "";
    this.lastName = options.lastName || "";
    this.isActive = options.isActive || true;

    if (options.created) {
        this.created = options.created;
    }

    if (options.updated) {
        this.updated = options.updated;
    }
}

_.extend(User, {

    create: function (userData, next) {
        debug("Creating user with data:", userData);

        var user,
            validationErrors = User.validate(userData);

        if (validationErrors) {
            throw new Error("Invalid input", validationErrors);
        }

        user = new User(userData);

        async.series({
            usernameExists: function (cb) {
                db.users.findByUsername(user.username, function (err, results) {
                    var usernameExists = results.length;
                    cb(err, usernameExists);
                });
            },
            emailExists: function (cb) {
                db.users.findByEmail(user.email, function (err, results) {
                    var emailExists = results.length;
                    cb(err, emailExists);
                });
            },
            passwordHash: function (cb) {
                pw.hash(user.password, function (err, hash) {
                    cb(err, hash);
                });
            }
        }, function (err, results) {
            if (err) {
                debug("ERROR creating user:", err);
                throw new Error("Error creating user");
            }

            debug("Create User async results:", results);

            if (results.usernameExists) {
                debug("Aborting create user, username already exists");
                return next(new Error("Username already exists"), null);
            }

            if (results.emailExists) {
                debug("Aborting create user, email already in use");
                return next(new Error("Email address already in use"), null);
            }

            if (results.passwordHash === user.password) {
                debug("Aborting create user, password not hashed");
                return next(new Error("Unable to hash password successfully"), null);
            }

            if (!results.usernameExists && !results.emailExists) {
                debug("Username and email unique, password hashed, creating new user");
                user.password = results.passwordHash;
                db.users.create(user, function (err, newUser) {
                    if (next) {
                        return next(err, newUser);
                    }
                });
            }
        });
    },

    login: function (username, password, next) {
        var self = this;

        async.waterfall([
            function (cb) {
                self.findByUsername(username, function (err, user) {
                    debug("User?", user);
                    cb(err, user);
                });
            },
            function (user, cb) {
                debug("Verifying password for user:", user);
                if (user) {
                    pw.verify(user.password, password, function (err, isValid) {
                        debug("Password is valid?", isValid);
                        if (isValid) {
                            cb(err, { user: user, authenticated: true });
                        }
                    });
                }
            }
        ], function (err, results) {
            if (err) {
                // TODO: log the error
                debug("Authentication error:", err);
                throw new Error("Login failed");
            }

            if (results.authenticated) {
                debug("Authenticated successfully", results);
                return next(null, results);
            }
        });
    },

    findByUsername: function (username, next) {
        db.users.findByUsername(username, function (err, results) {
            if (results.length) {
                var user = _.first(results);
                return next(null, user);
            } else {
                return next(new Error("User not found"), null);
            }
        });
    },

    validate: function (target) {
        return validate(target, validationRules);
    }

});

module.exports = User;
