var debug = require("debug")("dogwood:tests:integration");
var cp = require("child_process");
var net = require("net");
var killTree = require("tree-kill");
var shell = require("shelljs");

var api;

function setEnv () {
    process.env.NODE_ENV = "int";
}

function resetEnv () {
    process.env.NODE_ENV = "dev";
}

function buildUpDatabase () {
    shell.exec("grunt db:migrate:up", { silent: true });
}

function tearDownDatabase () {
    shell.exec("grunt db:migrate:down", { silent: true });
}

function startApi () {
    debug("Starting API for test...");
    // set `silent: false` if you need to see output/debug statements from outside of this test suite
    api = cp.fork(process.cwd() + "/src/api/bin/api", { silent: true });
}

function waitForApi (done) {
    debug("Waiting for API...");
    var socket = new net.Socket();
    socket.setTimeout(1000);

    var tryConnect = function () {
        socket.connect(7000, "localhost");
    };

    socket
        .on("connect", function () {
            debug("Connected to API...");
            socket.destroy();
            done();
        })
        .on("error", function (err) {
            setTimeout(tryConnect, 500);
        })
        .on("timeout", function () {
            setTimeout(tryConnect, 500);
        });

    tryConnect();
}

function stopApi () {
    debug("Shutting down API...");
    killTree(api.pid, "SIGKILL");
}

module.exports = {
    setEnv: setEnv,
    resetEnv: resetEnv,
    buildUpDatabase: buildUpDatabase,
    tearDownDatabase: tearDownDatabase,
    startApi: startApi,
    waitForApi: waitForApi,
    stopApi: stopApi
};
