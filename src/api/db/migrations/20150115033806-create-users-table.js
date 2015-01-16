// var dbm = require("db-migrate");
// var type = dbm.dataType;
"use strict";

exports.up = function(db, callback) {
    db.createTable("users", {
        ifNotExists: true,
        columns: {
            id: { type: "bigint", primaryKey: true, autoIncrement: true },
            username: { type: "string", length: 255, notNull: true },
            password: { type: "string", length: 255, notNull: true },
            email: { type: "string", length: 255, notNull: true },
            firstName: { type: "string", length: 255 },
            lastName: { type: "string", length: 255 },
            isActive: { type: "boolean", notNull: true, defaultValue: true },
            created: { type: "timestamp", notNull: true, defaultValue: /* jshint -W053 */ new String("(current_timestamp at time zone 'utc')") }, /* jshint +W053 */
            updated: { type: "timestamp", notNull: true, defaultValue: /* jshint -W053 */ new String("(current_timestamp at time zone 'utc')") } /* jshint +W053 */
        }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable("users", callback);
};
