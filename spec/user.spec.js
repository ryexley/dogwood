var chai = require("chai");
var expect = chai.expect;
var should = chai.should;
var assert = chai.assert;
var debug = require("debug")("specs");

var User = require("../src/api/model/user");

describe("User Model", function () {
    var _user;

    beforeEach(function () {
        _user = new User({ username: "specuser", password: "P@ssw0rd!", email: "specuser@example.com" });
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

    describe("Validation", function () {
        it("should require a username value", function () {
            var results;

            results = User.validate(_user);
            expect(results).to.be.undefined();

            _user.username = null;

            results = User.validate(_user);
            expect(results.username).to.exist;
        });

        it("should require username to be no less than two characters long", function () {
            _user.username = "x";

            var results = User.validate(_user);
            expect(results.username).to.exist;
        });

        it("should require username to be no longer than 255 characters", function () {
            _user.username = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuv";

            var results = User.validate(_user);
            expect(results.username).to.exist;
        });

        it("should require a password value", function () {
            var results;

            results = User.validate(_user);
            expect(results).to.be.undefined();

            _user.password = null;

            results = User.validate(_user);
            expect(results.password).to.exist;
        });

        it("should require a password to be no less than 8 characters long", function () {
            _user.password = "test";

            var results = User.validate(_user);
            expect(results.password).to.exist;
        });

        it("should require an email value", function () {
            var results;

            results = User.validate(_user);
            expect(results).to.be.undefined();

            _user.email = null;
            results = User.validate(_user);
            expect(results.email).to.exist;
        });

        it("should require email to be a valid email address", function () {
            _user.email = "foo";

            var results = User.validate(_user);
            expect(results.email).to.exist;

            _user.email = 11;

            var results = User.validate(_user);
            expect(results.email).to.exist;
        });
    });

    describe("Management", function () {
        it("create function throws error on invalid input", function () {
            expect(User.create.bind(User, { password: "test" })).to.throw(Error, /Invalid input/);
        });

        xit("create function to hash given password", function (done) {
            var userData = {
                username: "testuser",
                password: "this is a new password",
                email: "testuser@example.com",
                firstName: "test",
                lastName: "user"
            };

            User.create(userData, function (results) {
                expect(results.password).to.not.equal(userData.password);
                done();
            });
        });
    });
});
