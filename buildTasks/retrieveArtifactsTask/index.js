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
            const artifactsString = tl.getInput('artifacts', true);
            if (!artifactsString) {
                tl.setResult(tl.TaskResult.Failed, 'Artifacts is required input');
                return;
            }
            let artifacts;
            let params;
            try {
                artifacts = JSON.parse(artifactsString);
                params = artifacts.map(n => `artifact=${n}`).join('&');
            }
            catch (e) {
                params = `artifact=${artifactsString}`;
            }
            console.log(`Retrieving artifact details from the stage '${stage}'`);
            axios_1.default.get(`${serviceUrl}/stages/${stage}/list?${params}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Retrieve Artifacts Azure DevOps Task v1.0.0',
                    'Authorization': `Bearer ${apiToken}`,
                }
            }).then(response => {
                if (response.status !== 200) {
                    tl.setResult(tl.TaskResult.Failed, `Cannot retrieve artifacts: ${response.data.message}`);
                }
                else {
                    console.log(`Successfully retrieved artifacts from the server`);
                    tl.setVariable('artifacts', JSON.stringify(response.data), false, true);
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
