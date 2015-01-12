// var User = require("../model/user");
var express = require("express");
var router = express.Router();

router.get("/login", function (req, res) {
    res.json({ message: "Dogwood auth login" });
});

module.exports = router;
