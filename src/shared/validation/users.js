"use strict";

module.exports = {
    username: {
        presence: true,
        length: { minimum: 2, maximum: 255 }
    },
    password: {
        presence: true,
        length: { minimum: 8, maximum: 255 }
    },
    email: {
        presence: true,
        email: true
    }
};
