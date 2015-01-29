"use strict";

module.exports = {
    changePassword: {
        username: {
            presence: true,
            length: { minimum: 2, maximum: 255 }
        },
        password: {
            presence: true
        },
        newPassword: {
            presence: true,
            length: { minimum: 8, maximum: 1024 }
        }
    }
};
