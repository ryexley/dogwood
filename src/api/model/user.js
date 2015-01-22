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
    debug("Validating data:", data);
    var validationResults = User.validate(data);
    done(null, validationResults);
}

function usernameExists (username, done) {
    debug("Checking for username:", username);
    db.users.findByUsername(username, function (err, results) {
        if (err) {
            return done(err, null);
        }

        return done(null, results.length ? true : false);
    });
}

function emailExists (email, done) {
    debug("Checking for email:", email);
    db.users.findByEmail(email, function (err, results) {
        if (err) {
            return done(err, null);
        }

        return done(null, results.length ? true : false);
    });
}

function hashPassword (password, done) {
    debug("Hashing password:", password);
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
        return done(new Error("Username already exists"), data);
    }

    if (data.check.emailExists) {
        return done(new Error("Email address already in use"), data);
    }

    if (data.check.hashedPassword === data.user.password) {
        return done(new Error("Unable to hash password successfully"), data);
    }

    if (!data.check.usernameExists && !data.check.emailExists) {
        data.user.password = data.check.hashedPassword;
        db.users.create(data.user, function (err, newUser) {
            if (done) {
                return done(err, newUser);
            }
        });
    }
}

_.extend(User, {

    newCreate: function (userData, done) {
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
