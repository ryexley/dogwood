var _ = require("lodash");
var env = process.env.NODE_ENV || "dev";
var path = require("path");
var migrateBin = path.join(process.cwd(), "node_modules/db-migrate/bin/db-migrate");
var dbConfigFile = path.join(process.cwd(), _.template("src/api/config/<%= env %>.database.json", { env: env }));
var migrationsDir = path.join(process.cwd(), "src/api/db/migrations");

var migrateOptions = {
    env: env,
    migrator: migrateBin,
    migrationsDir: migrationsDir,
    migrationsConfig: dbConfigFile
};

var createMigrationCommand = "{migrator} create {name} --env {env} --migrations-dir {migrationsDir} --config {migrationsConfig}";
var migrateUpCommand = "{migrator} up --env {env} --migrations-dir {migrationsDir} --config {migrationsConfig}";
var migrateDownCommand = "{migrator} down --env {env} --migrations-dir {migrationsDir} --config {migrationsConfig}";

// set lodash template interpolation
_.templateSettings.interpolate = /{([\s\S]+?)}/g;

module.exports = function (grunt, options) {

    grunt.registerTask("migration:create", "Creates a new database migration file", function () {
        var migrationName = grunt.option("name");

        if (migrationName && migrationName.length > 0) {
            grunt.task.run("exec:migration-create");
        } else {
            grunt.fail.fatal("You must specify a name to create a migration: `grunt migration:create --name=<migration-name>`");
        }
    });

    grunt.registerTask("db:migrate:up", "Migrate database forward", function () {
        grunt.task.run("exec:migrate-up");
    });

    grunt.registerTask("db:migrate:down", "Migrate database backward", function () {
        grunt.task.run("exec:migrate-down");
    });

    // TODO: implement this: https://github.com/unknownexception/grunt-db-migrate#clean-db

    return {
        "migration-create": _.template(createMigrationCommand, _.extend(migrateOptions, { name: grunt.option("name") })),
        "migrate-up": _.template(migrateUpCommand, migrateOptions),
        "migrate-down": _.template(migrateDownCommand, migrateOptions)
    };

};
