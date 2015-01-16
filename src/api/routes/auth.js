"use strict";

// var User = require("../model/user");
var express = require("express");
var router = express.Router();
var data = require("../data");

router.get("/login", function (req, res) {
    data.users.create("foo");
    res.json({ message: "Dogwood auth login" });
});

module.exports = router;
