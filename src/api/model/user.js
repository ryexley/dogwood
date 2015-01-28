"use strict";

var _ = require("lodash");
var async = require("async");
var debug = require("debug")("user-model");
var validate = require("validate.js");
var pw = require("credential");

var validationRules = require("../../shared/validation").users;
var db = require("../data");

// User constructor
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

// private functions
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

// static User functions
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
        this.findByUsername(username, function (err, user) {
            if (err) {
                return next(err, null);
            }

            if (user) {
                pw.verify(user.password, password, function (err, isValid) {
                    if (err) {
                        next(err, null);
                    }

                    if (isValid) {
                        next(null, { user: user, authenticated: true });
                    } else {
                        next(new Error("Invalid password"), null);
                    }
                });
            } else {
                next(new Error("User not found"), null);
            }
        });
    },

    // TODO: implement a change password function:
    // changePassword: function (username, password, newPassword)

    // TODO: implement a forgot password function:
    // requestPasswordReset: function (email)
    // logic: should generate and persist a record in the database with a
    // token and an expiration (configurable, something like 24 hours from
    // the time the token is generated), and return a URL that contains
    // the token in it, that can be used to submit an updated password

    // TODO: implement a reset password for forgotten password requests:
    // resetForgottenPassword: function (passwordResetData)
    // passwordResetData = {
    //   token: <- this is the token generated in `requestPasswordReset`, validate that it exists, matches the given email address, and is not expired
    //   email: <- email address of the user requesting to reset password, validate that it matches the token
    //   password: <- new password, hash it, and set it on the user object
    // }

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
