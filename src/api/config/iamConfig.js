"use strict";

var User = require("../model/user");

var api = {
    getUserToken: function (user, next) {
        var token = {
            username: user.username
        };

        next(null, token);
    },

    getUserFromToken: function (token, next) {
        var username = token.username;

        User.findByUsername(username, function (err, user) {
            if (err) {
                return next(err);
            }

            return next(null, user);
        });
    }
};

module.exports = function (iam) {
    iam.getUserToken(api.getUserToken);
    iam.getUserFromToken(api.getUserFromToken);
};
