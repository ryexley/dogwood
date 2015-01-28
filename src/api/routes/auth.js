"use strict";

var debug = require("debug")("api-auth");
var express = require("express");
var router = express.Router();

var model = require("../model");
var User = model.user;

router.post("/register", function (/* req, */ res /*, next */) {
    // TODO: implement user registration logic: call User.create(req.body)
    res.json({ message: "Not implemented" });
});

router.post("/login", function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    User.login(username, password, function (err, result) {
        if (result.authenticated) {
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

module.exports = router;
