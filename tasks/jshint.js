module.exports = {
    options: {
        jshintrc: ".jshintrc",
        reporter: require("jshint-stylish")
    },
    files: {
        src: ["src/**/*.js"]
    }
};
