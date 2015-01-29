"use strict";

var debug = require("debug")("api-auth");
var express = require("express");
var router = express.Router();
var validate = require("validate.js");

var model = require("../model");
var validationRules = require("../../shared/validation").auth;
var User = model.user;

router.post("/register", function (req, res, next) {
    User.create(req.body, function (err, result) {
        if (err) {
            return next(err, null);
        }

        if (result && result.length) {
            var newUser = result[0];

            res.json({
                status: "success",
                message: "User created successfully",
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName
                }
            });
        } else {
            res.status(500).json({ message: "Error creating user" });
        }
    });
});

router.post("/login", function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    User.login(username, password, function (err, result) {
        if (err) {
            next(err, null);
        }

        debug("User login result:", result);
        if (result && result.authenticated) {
            debug("Creating user session with user:", result.user);
            req.createUserSession(result.user, function (err) {
                if (err) {
                    return next(err);
                }

                res.json({
                    message: "Login successful",
                    user: {
                        id: result.user.id,
                        username: result.user.username,
                        email: result.user.email,
                        firstName: result.user.firstName,
                        lastName: result.user.lastName
                    }
                });
            });
        } else {
            res.status(401).json({ message: "Login failed" });
        }
    });
});

router.post("/logout", function (req, res) {
    req.destroyUserSession();
    res.json({ message: "Logout successful" });
});

router.post("/change-password", function (req, res, next) {
    var validationResults = validate(req.body, validationRules.changePassword);

    if (validationRules.length) {
        res.status(400).json({
            status: "Error",
            message: "Invalid data",
            errors: validationResults
        });
    } else {
        User.changePassword(req.body.username, req.body.password, req.body.newPassword, function (err, results) {
            if (err) {
                next(err, null);
            }

            debug("Change password results:", results);

            if (results && results.passwordUpdated) {
                res.json({ status: "success", message: "Password successfully updated" });
            } else {
                res.status(500).json({ status: "error", message: "Error updating password" });
            }
        });
    }
});

module.exports = router;
