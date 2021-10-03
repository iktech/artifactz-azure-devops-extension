import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Publish Artifact task tests', function () {

    before( function() {

    });

    after(() => {

    });

    it('should succeed with simple inputs', function(done: Mocha.Done) {
        this.timeout(5000);

        let tp = path.join(__dirname, 'success.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");
        assert.strictEqual(tr.stdout.indexOf('Successfully published artifact \'test-data-publish\' version: 1.0.0') >= 0, true, "should display Hello human");
        done();
    });

    it('it should fail if serviceUrl is not specified', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'serviceUrl.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: apiToken', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully published artifact '), -1, "Should not display");

        done();
    });

    it('it should fail if apiToken is not specified', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'apiToken.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: apiToken', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully published artifact '), -1, "Should not display Hello bad");

        done();
    });

    it('it should fail if stage is not specified', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'stage.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: stage', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully published artifact '), -1, "Should not display Hello bad");

        done();
    });

    it('it should fail if name is not specified', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'name.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: name', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully published artifact '), -1, "Should not display Hello bad");

        done();
    });

    it('it should fail if type is not specified', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'type.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: type', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully published artifact '), -1, "Should not display Hello bad");

        done();
    });

    it('it should fail if incorrect type is specified', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'incorrectType.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Incorrect Artifact Type supplied. Accepted values are JAR, WAR, EAR and DockerImage', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully published artifact '), -1, "Should not display Hello bad");

        done();
    });

    it('it should fail if groupId is not specified for the Java type', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'noGroupIdJava.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Group and Artifact IDs are required inputs for the Java artifacts', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully published artifact '), -1, "Should not display Hello bad");

        done();
    });

    it('it should fail if artifactId is not specified for the Java type', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'noArtifactIdJava.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Group and Artifact IDs are required inputs for the Java artifacts', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully published artifact '), -1, "Should not display Hello bad");

        done();
    });

    it('it should fail if version is not specified for the Java type', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'versionJava.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: version', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully published artifact '), -1, "Should not display Hello bad");

        done();
    });

    it('it should fail if version is not specified', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'version.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: version', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully published artifact '), -1, "Should not display Hello bad");

        done();
    });
});
