"use strict";

var User = require("../model").user;

var api = {
    getUserToken: function (user, done) {
        var token = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };

        done(null, token);
    },

    getUserFromToken: function (token, done) {
        User.findById(token.id, function (err, user) {
            if (err) {
                return done(err);
            }

            return done(null, user);
        });
    }
};

module.exports = function (iam) {
    iam.getUserToken(api.getUserToken);
    iam.getUserFromToken(api.getUserFromToken);
};
