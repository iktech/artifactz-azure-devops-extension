import tl = require('azure-pipelines-task-lib/task');
import axios from 'axios';

async function run() {
    try {
        // Validate inputs
        const serviceUrl: string | undefined = tl.getInput('serviceUrl', true);
        if (!serviceUrl) {
            tl.setResult(tl.TaskResult.Failed, 'Service URL is required input');
            return;
        }

        const apiToken: string | undefined = tl.getInput('apiToken', true);
        if (!apiToken) {
            tl.setResult(tl.TaskResult.Failed, 'API Token is required input');
            return;
        }

        const stage: string | undefined = tl.getInput('stage', true);
        if (!stage) {
            tl.setResult(tl.TaskResult.Failed, 'Stage is required input');
            return;
        }

        const artifact: string | undefined = tl.getInput('artifact', true);
        if (!artifact) {
            tl.setResult(tl.TaskResult.Failed, 'Artifact is required input');
            return;
        }

        console.log(`Retrieving artifact details from the stage '${stage}'`);
        try {
            let response = await axios.get(`${serviceUrl}/stages/${stage}/list?artifact=${artifact}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Retrieve Artifacts Azure DevOps Task v1.0.0',
                    'Authorization': `Bearer ${apiToken}`,
                }
            });
            if (response.status !== 200) {
                tl.setResult(tl.TaskResult.Failed, `Cannot retrieve artifact version: ${response.data.message}`);
            } else {
                let data = ""
                console.log(`Successfully retrieved artifact version from the server`);
                if (response.data.artifacts && response.data.artifacts.length === 1) {
                    data = response.data.artifacts[0].version;
                }
                tl.setVariable('version', data, false, true);
            }
        } catch(error: any) {
            tl.setResult(tl.TaskResult.Failed, error.response.data.error);
        }
    }
    catch (err) {
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        } else {
            tl.setResult(tl.TaskResult.Failed, 'Failed to retrieve artifact version');
        }
    }
}

run();
