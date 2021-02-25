"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const axios_1 = __importDefault(require("axios"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Validate inputs
            const serviceUrl = tl.getInput('serviceUrl', true);
            if (!serviceUrl) {
                tl.setResult(tl.TaskResult.Failed, 'Service URL is required input');
                return;
            }
            const apiToken = tl.getInput('apiToken', true);
            if (!apiToken) {
                tl.setResult(tl.TaskResult.Failed, 'API Token is required input');
                return;
            }
            const stage = tl.getInput('stage', true);
            if (!stage) {
                tl.setResult(tl.TaskResult.Failed, 'Stage is required input');
                return;
            }
            const name = tl.getInput('name', true);
            if (!name) {
                tl.setResult(tl.TaskResult.Failed, 'Artifact Name is required input');
                return;
            }
            const version = tl.getInput('version', false);
            // Build a payload object
            let payload = {
                stage_name: stage,
                artifact_name: name,
                version: undefined,
            };
            if (version) {
                payload = Object.assign(Object.assign({}, payload), { version });
            }
            console.log(`Pushing artifact '${name}' from the stage '${stage}'`);
            if (version) {
                console.log(`Pushing version ${version}`);
            }
            axios_1.default.put(`${serviceUrl}/artifacts/push`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Push Artifact Azure DevOps Task v1.0.0',
                    'Authorization': `Bearer ${apiToken}`,
                }
            }).then(response => {
                if (response.status !== 200) {
                    tl.setResult(tl.TaskResult.Failed, `Cannot push artifact '${name}': ${response.data.message}`);
                }
                else {
                    console.log(`Successfully pushed artifact '${name}' version: ${response.data.version}`);
                    tl.setVariable('version', response.data.version, false, true);
                }
            }).catch(error => {
                tl.setResult(tl.TaskResult.Failed, error.response.data.error);
            });
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
