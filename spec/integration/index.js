var _ = require("lodash");
var chai = require("chai");
var expect = chai.expect;
var should = chai.should;
var assert = chai.assert;
var debug = require("debug")("dogwood:tests:integration");
var cp = require("child_process");
var net = require("net");
var killTree = require("tree-kill");
var shell = require("shelljs");
var request = require("superagent");

// set lodash template interpolation
_.templateSettings.interpolate = /{([\s\S]+?)}/g;

var api;
var routes = {
    apiRoot: "http://localhost:7000/api/",
    auth: {
        createUser: "auth/register"
    }
};

function setEnv () {
    process.env.NODE_ENV = "int";
}

function resetEnv () {
    process.env.NODE_ENV = "dev";
}

function startAPI () {
    debug("Starting API for test...");
    api = cp.fork(process.cwd() + "/src/api/bin/api");
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

function stopAPI () {
    debug("Shutting down API...");
    killTree(api.pid, "SIGKILL");
}

describe("IntegrationTests", function () {

    before(function (done) {
        setEnv();
        shell.exec("grunt db:migrate:up", { silent: true });
        startAPI();
        waitForApi(done);

        this.timeout(5000);
    });

    after(function () {
        stopAPI();
        shell.exec("grunt db:migrate:down", { silent: true });
        resetEnv();
    });

    describe("Dogwood API", function () {

        it("should have a root endpoint", function (done) {
            request.get(routes.apiRoot).end(function (res) {
                expect(res.body.success).to.be.true;
                expect(res.body.message).to.equal("Dogwood API");
                done();
            });
        });

        describe("Auth", function () {

            it("should successfully register a user with valid input data", function (done) {
                request
                    .post(routes.apiRoot + routes.auth.createUser)
                    .send({
                        username: "testuser",
                        password: "P@s$w0rd!",
                        email: "test@example.com"
                    })
                    .on("error", function (err) {
                        debug("ERROR!", err);
                    })
                    .end(function (res) {
                        expect(res.body.success).to.be.true;
                        done();
                    });
            });

            it("should error when attempting to register a user without a username", function (done) {
                request
                    .post(routes.apiRoot + routes.auth.createUser)
                    .send({
                        password: "P@s$w0rd!",
                        email: "test@example.com",
                        firstName: "Test",
                        lastName: "User"
                    })
                    .on("error", function (err) {
                        debug("ERROR!", err);
                    })
                    .end(function (res) {
                        expect(res.body.success).to.be.false;
                        expect(res.body.statusCode).to.equal(500);
                        done();
                    });
            });

        });

    });

});
