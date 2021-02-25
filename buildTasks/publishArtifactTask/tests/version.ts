import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('serviceUrl', 'https://artifactor-uat.iktech.io');
tmr.setInput('apiToken', '2b7f0fa0-343a-4a1f-8015-e7801b4152fe');
tmr.setInput('stage', 'Development');
tmr.setInput('name', 'test-data');
tmr.setInput('type', 'DockerImage');

tmr.run();
