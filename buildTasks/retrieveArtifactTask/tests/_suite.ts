import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Publish Artifact task tests', function () {

    before( function() {

    });

    after(() => {

    });

    it('should succeed with array', async () => {
        let tp = path.join(__dirname, 'success.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        await tr.runAsync();
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifact version from the server') >= 0, true, "should display success message");
        assert.strictEqual(tr.stdout.indexOf('##vso[task.setvariable variable=version;isOutput=true;issecret=false;]1.0.1') >= 0, true, "should set variable");
    });

    it('it should fail if serviceUrl is not specified', async () => {
        let tp = path.join(__dirname, 'serviceUrl.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        await tr.runAsync();
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: apiToken', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifacts from the server'), -1, "Should not display Hello bad");

    });

    it('it should fail if apiToken is not specified', async () => {
        let tp = path.join(__dirname, 'apiToken.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        await tr.runAsync();
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: apiToken', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifacts from the server'), -1, "Should not display Hello bad");

    });

    it('it should fail if stage is not specified', async () => {
        let tp = path.join(__dirname, 'stage.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        await tr.runAsync();
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: stage', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifacts from the server'), -1, "Should not display Hello bad");

    });

    it('it should fail if artifacts is not specified', async () => {
        let tp = path.join(__dirname, 'name.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        await tr.runAsync();
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: artifact', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifacts from the server'), -1, "Should not display Hello bad");

    });
});
