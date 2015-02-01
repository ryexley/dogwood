var _ = require("lodash");
var chai = require("chai");
var expect = chai.expect;
var should = chai.should;
var assert = chai.assert;
var debug = require("debug")("integration-tests");
var cp = require("child_process");
var kill = require("tree-kill");
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
    api = cp.spawn("node", [process.cwd() + "/src/api/bin/api"], { stdio: "pipe" });
    api.stdout.on("data", function (data) {
        debug("API:", data);
    });
    api.stderr.on("data", function (data) {
        debug("API ERROR:", data);
    });
    api.on("close", function (code) {
        debug("API CLOSED with exit code:", code);
    });
}

function stopAPI () {
    kill(api.pid, "SIGKILL");
}

describe("IntegrationTests", function () {

    before(function () {
        setEnv();
        shell.exec("grunt db:migrate:up", { silent: true });
        startAPI();
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

            xit ("can register a user", function (done) {
                request
                    .post(routes.apiRoot + routes.auth.createUser)
                    .send({
                        username: "testuser",
                        password: "P@s$w0rd!",
                        email: "test@example.com"
                    })
                    .end(function (res) {
                        expect(res.body.success).to.be.true;
                        done();
                    });
            });

        });

    });

});
