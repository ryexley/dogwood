var _ = require("lodash");

function User (options) {
    this.username = options.username;
    this.password = options.password;
    this.firstName = options.firstName || "";
    this.lastName = options.lastName || "";
}

_.extend(User, {

    login: function (username, password, next) {
        // TODO: implement some actual authentication logic here

        var user;

        if (username) {
            user = new User(username, password);
        }

        next(null, user);
    },

    findByUsername: function (username, next) {
        // TODO: implement some actual username lookup functionality here

        var user;

        if (username) {
            user = new User(username, "");
        }

        next(null, user);
    }

});

module.exports = User;
