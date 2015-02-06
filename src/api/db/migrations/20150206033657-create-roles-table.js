"use strict";

var async = require("async");
// var dbm = require('db-migrate');
// var type = dbm.dataType;

exports.up = function(db, callback) {
    async.series([
        db.createTable.bind(db, "roles", {
            ifNotExists: true,
            columns: {
                id: { type: "int", primaryKey: true, autoIncrement: true },
                name: { type: "string", length: 100, notNull: true },
                description: { type: "string", length: 255 }
            }
        }),
        db.insert.bind(db, "roles", ["name", "description"], ["admin", "Application administrators"]),
        db.insert.bind(db, "roles", ["name", "description"], ["contributor", "Users can contribute content to the system"]),
        db.insert.bind(db, "roles", ["name", "description"], ["viewer", "Users with read-only permissions"])
    ], callback);
};

exports.down = function(db, callback) {
    db.dropTable("roles", callback);
};
