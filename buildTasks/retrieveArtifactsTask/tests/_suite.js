"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const assert = __importStar(require("assert"));
const ttm = __importStar(require("azure-pipelines-task-lib/mock-test"));
describe('Publish Artifact task tests', function () {
    before(function () {
    });
    after(() => {
    });
    it('should succeed with array', function (done) {
        this.timeout(5000);
        let tp = path.join(__dirname, 'success.js');
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        console.log(tr.succeeded);
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");
        console.log(tr.stdout);
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifacts from the server') >= 0, true, "should display success message");
        assert.strictEqual(tr.stdout.indexOf('##vso[task.setvariable variable=artifacts;isOutput=true;issecret=false;]{"stage":"Development","artifacts":[{"artifact_name":"test-data","type":"JAR","group_id":"io.iktech.test","artifact_id":"test-data","version":"1.0.0"}]}') >= 0, true, "should set variable");
        done();
    });
    it('should succeed with single artifact', function (done) {
        this.timeout(5000);
        let tp = path.join(__dirname, 'success.js');
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        console.log(tr.succeeded);
        assert.strictEqual(tr.succeeded, true, 'should have succeeded');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 0, "should have no errors");
        console.log(tr.stdout);
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifacts from the server') >= 0, true, "should display success message");
        assert.strictEqual(tr.stdout.indexOf('##vso[task.setvariable variable=artifacts;isOutput=true;issecret=false;]{"stage":"Development","artifacts":[{"artifact_name":"test-data","type":"JAR","group_id":"io.iktech.test","artifact_id":"test-data","version":"1.0.0"}]}') >= 0, true, "should set variable");
        done();
    });
    it('it should fail if serviceUrl is not specified', function (done) {
        this.timeout(1000);
        let tp = path.join(__dirname, 'serviceUrl.js');
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        console.log(tr.succeeded);
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: serviceUrl', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifacts from the server'), -1, "Should not display Hello bad");
        done();
    });
    it('it should fail if apiToken is not specified', function (done) {
        this.timeout(1000);
        let tp = path.join(__dirname, 'apiToken.js');
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        console.log(tr.succeeded);
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: apiToken', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifacts from the server'), -1, "Should not display Hello bad");
        done();
    });
    it('it should fail if stage is not specified', function (done) {
        this.timeout(1000);
        let tp = path.join(__dirname, 'stage.js');
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        console.log(tr.succeeded);
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: stage', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifacts from the server'), -1, "Should not display Hello bad");
        done();
    });
    it('it should fail if artifacts is not specified', function (done) {
        this.timeout(1000);
        let tp = path.join(__dirname, 'name.js');
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        console.log(tr.succeeded);
        assert.strictEqual(tr.succeeded, false, 'should have failed');
        assert.strictEqual(tr.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(tr.errorIssues[0], 'Input required: artifacts', 'error issue output');
        assert.strictEqual(tr.stdout.indexOf('Successfully retrieved artifacts from the server'), -1, "Should not display Hello bad");
        done();
    });
});
