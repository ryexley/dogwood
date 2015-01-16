"use strict";

var debug = require("debug")("routes");
var root = require("./root");
var auth = require("./auth");

var express = require("express");
var router = express.Router();

router.use("/api", root);
router.use("/api/auth", auth);

debug("Exporting router:", router);
module.exports = router;
