var dbm = require('db-migrate');
var type = dbm.dataType;

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
            created: { type: "timestamp", notNull: true, defaultValue: new String("(current_timestamp at time zone 'utc')") },
            updated: { type: "timestamp", notNull: true, defaultValue: new String("(current_timestamp at time zone 'utc')") }
        }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable("users", callback);
};
