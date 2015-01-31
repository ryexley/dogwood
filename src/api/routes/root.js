"use strict";

var debug = require("debug")("api-root");
var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    debug("Logged in user:", req.user);
    res.success({ message: "Dogwood API" });
});

module.exports = router;
