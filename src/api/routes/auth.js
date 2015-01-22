"use strict";

var express = require("express");
var router = express.Router();

var model = require("../model");
var User = model.user;

router.post("/login", function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    User.login(username, password, function (err, result) {
        if (result.authenticated) {
            req.createUserSession(result.user, function (err) {
                if (err) {
                    return next(err);
                }

                res.json({ message: "Login successful" });
            });
        } else {
            res.status(401).json({ message: "Login failed" });
        }
    });
});

module.exports = router;
