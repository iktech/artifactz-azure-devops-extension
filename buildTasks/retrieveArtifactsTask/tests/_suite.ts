import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Publish Artifact task tests', function () {

    before( function() {

    });

    after(() => {

    });

    it('should succeed with array', function(done: Mocha.Done) {
        this.timeout(5000);

        let tp = path.join(__dirname, 'success.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifacts from the server') >= 0, true, "should display success message");
        assert.strictEqual(tr.stdout.indexOf('##vso[task.setvariable variable=artifacts;isOutput=true;issecret=false;]{"gradle-plugin-test":"1.0.0-SNAPSHOT","test-data":"1.0.0"}') >= 0, true, "should set variable");
        done();
    });

    it('should succeed with single artifact', function(done: Mocha.Done) {
        this.timeout(5000);

        let tp = path.join(__dirname, 'successSingle.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifacts from the server') >= 0, true, "should display success message");
        assert.strictEqual(tr.stdout.indexOf('##vso[task.setvariable variable=artifacts;isOutput=true;issecret=false;]{"test-data":"1.0.0"}') >= 0, true, "should set variable");
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
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifacts from the server'), -1, "Should not display Hello bad");

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
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifacts from the server'), -1, "Should not display Hello bad");

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
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifacts from the server'), -1, "Should not display Hello bad");

        done();
    });

    it('it should fail if artifacts is not specified', function(done: Mocha.Done) {
        this.timeout(1000);

        let tp = path.join(__dirname, 'name.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: artifacts', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifact from the server'), -1, "Should not display Hello bad");

        done();
    });
});
