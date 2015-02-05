var helper = require("./helper");
var authTests = require("./auth");

describe("IntegrationTests", function () {

    before(function (done) {
        // this shouldn't take more than 5 seconds to complete...
        // if it does, there's something wrong
        this.timeout(5000);

        helper.setEnv();
        helper.buildUpDatabase();
        helper.startApi();
        helper.waitForApi(done);
    });

    after(function () {
        helper.stopApi();
        helper.tearDownDatabase();
        helper.resetEnv();
    });

    describe("Dogwood API", function () {

        authTests();

    });

});
