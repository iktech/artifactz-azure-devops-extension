"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
let taskPath = path.join(__dirname, '..', 'index.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
tmr.setInput('serviceUrl', 'https://artifactor-uat.iktech.io');
tmr.setInput('apiToken', '2b7f0fa0-343a-4a1f-8015-e7801b4152fe');
tmr.run();
