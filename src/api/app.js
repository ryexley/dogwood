/* https://github.com/derickbailey/iam/tree/master/demo */
/* https://github.com/ericelliott/credential */

"use strict";

var express = require("express");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    name: "dogwood",
    secret: "GoDucks!",
    resave: false,
    rolling: true,
    saveUninitialized: true
}));

var iam = require("iam");
var iamConfig = require("./config/iamConfig");
iam.configure(iamConfig);
app.use(iam.middleware());

var routes = require("./routes");
app.use("/", routes);

app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// development error handler, prints a stack trace
if (app.get("env") === "development") {
    app.use(function (err, req, res/* , next */) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

// production error handler, no stack trace
app.use(function (err, req, res/*, next */) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});

module.exports = app;
