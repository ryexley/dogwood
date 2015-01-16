module.exports = {
    options: {
        jshintrc: ".jshintrc",
        reporter: require("jshint-stylish"),
        verbose: true
    },
    files: {
        src: ["src/**/*.js"]
    }
};
