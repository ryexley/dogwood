var _ = require("lodash");
var debug = require("debug")("dogwood:tests:integration");
var chai = require("chai");
var expect = chai.expect;
var should = chai.should;
var assert = chai.assert;
var request = require("superagent");

module.exports = function () {

    var routes = {
        apiRoot: "http://localhost:7000/api/"
    };

    describe("API root", function () {

        it("should have a root endpoint", function (done) {
            request.get(routes.apiRoot).end(function (res) {
                 expect(res.body.success).to.be.true;
                 expect(res.body.message).to.equal("Dogwood API");
                 done();
            });
        });

    });

};
