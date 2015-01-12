var root = require("./root");
var auth = require("./auth");

var express = require("express");
var router = express.Router();

router.use("/api", root);
router.use("/api/auth", auth);

module.exports = router;
