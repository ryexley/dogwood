var _ = require("lodash");
var chai = require("chai");
var expect = chai.expect;
var should = chai.should;
var assert = chai.assert;
var debug = require("debug")("integration-tests");
var shell = require("shelljs");
var request = require("superagent");

// set lodash template interpolation
_.templateSettings.interpolate = /{([\s\S]+?)}/g;

var apiRoot = "http://localhost:7000/api/";

function setEnv () {
    process.env.NODE_ENV = "int";
};

function resetEnv () {
    process.env.NODE_ENV = "dev";
}

describe("IntegrationTests", function () {

    before(function () {
        setEnv();
        shell.exec("grunt db:migrate:up", { silent: true });
    });

    after(function () {
        shell.exec("grunt db:migrate:down", { silent: true });
        resetEnv();
    });

    describe("Dogwood API", function () {

        it("should have a root endpoint", function (done) {
            request.get(apiRoot).end(function (res) {
                expect(res.body.success).to.be.true;
                expect(res.body.message).to.equal("Dogwood API");
                done();
            });
        });

        describe("Auth", function () {

        });

    });

});
