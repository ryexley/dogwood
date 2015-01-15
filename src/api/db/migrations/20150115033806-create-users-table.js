var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.createTable("users", {
        ifNotExists: true,
        columns: {
            id: { type: "int", primaryKey: true, autoIncrement: true },
            username: { type: "string", length: 255, notNull: true },
            password: { type: "string", length: 1024, notNull: true },
            firstName: { type: "string", length: 255 },
            lastName: { type: "string", length: 255 }
        }
    }, callback);
};

exports.down = function(db, callback) {
    db.dropTable("users", callback);
};
