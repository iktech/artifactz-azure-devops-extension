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
            const stageDescription = tl.getInput('stageDescription', false);
            const name = tl.getInput('name', true);
            if (!name) {
                tl.setResult(tl.TaskResult.Failed, 'Artifact Name is required input');
                return;
            }
            const description = tl.getInput('description', false);
            const flow = tl.getInput('flow', false);
            const type = tl.getInput('type', true);
            if (!type) {
                tl.setResult(tl.TaskResult.Failed, 'Artifact Type is required input');
                return;
            }
            if (['JAR', 'WAR', 'EAR', 'DockerImage'].indexOf(type) === -1) {
                tl.setResult(tl.TaskResult.Failed, 'Incorrect Artifact Type supplied. Accepted values are JAR, WAR, EAR and DockerImage');
                return;
            }
            const groupId = tl.getInput('groupId', false);
            const artifactId = tl.getInput('artifactId', false);
            if (['JAR', 'WAR', 'EAR'].indexOf(type) > -1) {
                if (!groupId || !artifactId) {
                    tl.setResult(tl.TaskResult.Failed, 'Group and Artifact IDs are required inputs for the Java artifacts');
                    return;
                }
            }
            const version = tl.getInput('version', true);
            if (!version) {
                tl.setResult(tl.TaskResult.Failed, 'Artifact Version is required input');
                return;
            }
            // Build a payload object
            let payload = {
                stage,
                stage_description: undefined,
                flow: undefined,
                artifact_name: name,
                artifact_description: undefined,
                type,
                group_id: undefined,
                artifact_id: undefined,
                version,
            };
            if (stageDescription) {
                payload = Object.assign(Object.assign({}, payload), { stage_description: stageDescription });
            }
            if (description) {
                payload = Object.assign(Object.assign({}, payload), { artifact_description: description });
            }
            if (flow) {
                payload = Object.assign(Object.assign({}, payload), { flow });
            }
            if (groupId) {
                payload = Object.assign(Object.assign({}, payload), { group_id: groupId });
            }
            if (artifactId) {
                payload = Object.assign(Object.assign({}, payload), { artifact_id: artifactId });
            }
            console.log(`Publishing artifact '${name}' details to the ${serviceUrl}`);
            axios_1.default.put(`${serviceUrl}/artifacts/versions`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Publish Artifact Azure DevOps Task v1.0.0',
                    'Authorization': `Bearer ${apiToken}`,
                }
            }).then(response => {
                if (response.status !== 202) {
                    tl.setResult(tl.TaskResult.Failed, `Cannot publish artifact '${name}' version: ${response.data.message}`);
                }
                else {
                    console.log(`Successfully published artifact '${name}' version: ${version}`);
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
