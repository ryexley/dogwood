var chai = require("chai");
var expect = chai.expect;
var should = chai.should;
var assert = chai.assert;

var User = require("../src/api/model/user");

describe("User Model", function () {
    var _user;

    beforeEach(function () {
        _user = new User({ username: "specuser", password: "P@ssw0rd!" });
    });

    afterEach(function () {
        _user = null;
    });

    it("instances can be created", function () {
        expect(_user).to.exist;
        expect(_user).to.be.an.instanceof(User);
    });

    it("should have a username property of the appropriate type", function () {
        expect(_user.username).to.exist;
        expect(_user.username).to.be.a("string");
    });

    it("should have a password property of the appropriate type", function () {
        expect(_user.password).to.exist;
        expect(_user.password).to.be.a("string");
    });

    it("should have an email address property of the appropriate type", function () {
        expect(_user.email).to.exist;
        expect(_user.email).to.be.a("string");
    });

    it("should have a firstName property of the appropriate type", function () {
        expect(_user.firstName).to.exist;
        expect(_user.firstName).to.be.a("string");
    });

    it("should have a lastName property of the appropriate type", function () {
        expect(_user.lastName).to.exist;
        expect(_user.lastName).to.be.a("string");
    });

    it("should have an isActive property of the appropriate type", function () {
        expect(_user.isActive).to.exist;
        expect(_user.isActive).to.be.a("boolean");
    });

    it("should have a created property of the appropriate type", function () {
        expect(_user.created).to.exist;
        expect(_user.created).to.be.a("date");
    });

    it("should have an updated property of the appropriate type", function () {
        expect(_user.updated).to.exist;
        expect(_user.updated).to.be.a("date");
    });
});
