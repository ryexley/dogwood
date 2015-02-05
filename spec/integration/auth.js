var _ = require("lodash");
var debug = require("debug")("dogwood:tests:integration");
var chai = require("chai");
var expect = chai.expect;
var should = chai.should;
var assert = chai.assert;
var request = require("superagent");

module.exports = function () {

    var routes = {
        apiRoot: "http://localhost:7000/api/",
        auth: {
            createUser: "auth/register",
            login: "auth/login"
        }
    };

    var testData = {
        validUser: {
            username: "testuser",
            password: "P@s$w0rd!",
            email: "text@example.com",
            firstName: "Test",
            lastName: "User"
        }
    };

    function useData(data) {
        return _.clone(data, true);
    }

    describe("Auth", function () {

        describe("Register/Create User", function () {

            it("should successfully register a user with valid input data", function (done) {
                request
                    .post(routes.apiRoot + routes.auth.createUser)
                    .send(useData(testData.validUser))
                    .end(function (res) {
                        expect(res.body.success).to.be.true;
                        expect(res.body.data).to.exist;
                        expect(res.body.data.id).to.be.an.integer;
                        done();
                    });
            });

            it("should return an error when attempting to register a user without a username", function (done) {
                var data = useData(testData.validUser);
                data = _.omit(data, "username");

                request
                    .post(routes.apiRoot + routes.auth.createUser)
                    .send(data)
                    .end(function (res) {
                        expect(res.body.success).to.be.false;
                        expect(res.body.statusCode).to.equal(500);
                        done();
                    });
            });

            it("should return an error when attempting to register a user with an invalid password", function (done) {
                request
                    .post(routes.apiRoot + routes.auth.createUser)
                    .send(_.extend(useData(testData.validUser), { password: "foo" }))
                    .end(function (res) {
                        expect(res.body.success).to.be.false;
                        expect(res.body.statusCode).to.equal(500);
                        done();
                    });
            });

            it("should return an error when attempting to register a user with a username that already exists", function (done) {
                request
                    .post(routes.apiRoot + routes.auth.createUser)
                    .send(useData(testData.validUser))
                    .end(function (res) {
                        expect(res.body.success).to.be.false;
                        expect(res.body.message).to.have.string("Error registering user");
                        expect(res.body.data).to.have.string("Username already exists");
                        done();
                    });
            });

            it("should return an error when attempting to register a user with an email that already exists", function (done) {
                request
                    .post(routes.apiRoot + routes.auth.createUser)
                    .send(_.extend(useData(testData.validUser), { username: "testuser2" }))
                    .end(function (res) {
                        expect(res.body.success).to.be.false;
                        expect(res.body.message).to.have.string("Error registering user");
                        expect(res.body.data).to.have.string("Email address already in use");
                        done();
                    });
            });

        });

        describe("Login", function () {

            var credentials;

            beforeEach(function () {
                credentials = useData(testData.validUser);
                credentials = {
                    username: credentials.username,
                    password: credentials.password
                };
            });

            it("should return login success when valid credentials are passed", function (done) {
                request
                    .post(routes.apiRoot + routes.auth.login)
                    .send(credentials)
                    .end(function (res) {
                        expect(res.body.success).to.be.true;
                        expect(res.body.message).to.have.string("Authentication success");
                        done();
                    });
            });

            it("should fail when attempting to login with a username that doesn't exist", function (done) {
                request
                    .post(routes.apiRoot + routes.auth.login)
                    .send(_.extend(credentials, { username: "foo" }))
                    .end(function (res) {
                        expect(res.body.success).to.be.false;
                        expect(res.body.message).to.have.string("Authentication failed");
                        expect(res.body.data).to.have.string("User not found");
                        done();
                    });
            });

            it("should fail when attempting to login with a valid user and an invalid password", function (done) {
                request
                    .post(routes.apiRoot + routes.auth.login)
                    .send(_.extend(credentials, { password: "Pas$w0rd!"}))
                    .end(function (res) {
                        expect(res.body.success).to.be.false;
                        expect(res.body.message).to.have.string("Authentication failed");
                        expect(res.body.data).to.have.string("Invalid password");
                        done();
                    });
            });

            xit("should establish a user session after successful login/authentication", function (done) {
                request
                    .post(routes.apiRoot + routes.auth.login)
                    .send(credentials)
                    .end(function (res) {
                        done();
                    });
            });

        });


        describe("Logout", function () {

            xit("should destroy the existing user session after successful logout", function (done) {

            });

        });

        describe("Change password", function () {

        });

    });

};
