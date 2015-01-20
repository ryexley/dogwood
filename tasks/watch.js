module.exports = {
    "js": {
        files: ["src/**/*.js"],
        tasks: ["jshint", "exec:run-tests"]
    },
    "js-specs": {
        files: ["spec/**/*.js"],
        tasks: ["exec:run-tests"]
    },
    "sass": {
        files: ["src/**/*.scss"],
        tasks: ["sass"]
    }
};
