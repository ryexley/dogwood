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

function validateUserData (data, done) {
    var validationResults = User.validate(data);
    done(null, validationResults);
}

function usernameExists (username, done) {
    db.users.findByUsername(username, function (err, results) {
        if (err) {
            return done(err, null);
        }

        return done(null, results.length ? true : false);
    });
}

function emailExists (email, done) {
    db.users.findByEmail(email, function (err, results) {
        if (err) {
            return done(err, null);
        }

        return done(null, results.length ? true : false);
    });
}

function hashPassword (password, done) {
    pw.hash(password, function (err, hash) {
        if (err) {
            return done(err, null);
        }

        return done(null, hash);
    });
}

function createUser (data, done) {
    if (data.check.invalidData) {
        return done(new Error("Invalid input data"), data);
    }

    if (data.check.usernameExists) {
        debug("Aborting create user, username already exists");
        return done(new Error("Username already exists"), data);
    }

    if (data.check.emailExists) {
        debug("Aborting create user, email already in use");
        return done(new Error("Email address already in use"), data);
    }

    if (data.check.hashedPassword === data.user.password) {
        debug("Aborting create user, password not hashed");
        return done(new Error("Unable to hash password successfully"), data);
    }

    if (!data.check.usernameExists && !data.check.emailExists) {
        debug("Username and email unique, password hashed, creating new user");
        data.user.password = data.check.hashedPassword;
        db.users.create(data.user, function (err, newUser) {
            if (done) {
                return done(err, newUser);
            }
        });
    }
}

_.extend(User, {

    create: function (userData, done) {
        var canCreateUser = {
            invalidData: validateUserData.bind(null, userData),
            usernameExists: usernameExists.bind(null, userData.username),
            emailExists: emailExists.bind(null, userData.email),
            hashedPassword: hashPassword.bind(null, userData.password)
        };

        async.series(canCreateUser, function (err, results) {
            if (err) {
                return done(err, results);
            }

            createUser({ check: results, user: userData }, done);
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

    findById: function (id, next) {
        db.users.findById(id, function (err, results) {
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
