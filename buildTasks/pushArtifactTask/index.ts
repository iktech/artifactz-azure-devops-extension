import tl = require('azure-pipelines-task-lib/task');
import axios from 'axios';

type PushArtifactRequest = {
    stage_name: String,
    artifact_name: String,
    version: String | undefined,
};

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

        const name: string | undefined = tl.getInput('name', true);
        if (!name) {
            tl.setResult(tl.TaskResult.Failed, 'Artifact Name is required input');
            return;
        }

        const version: string | undefined = tl.getInput('version', false);
        // Build a payload object
        let payload : PushArtifactRequest = {
            stage_name: stage,
            artifact_name: name,
            version: undefined,
        };

        if (version) {
            payload = {
                ...payload,
                version,
            }
        }

        console.log(`Pushing artifact '${name}' from the stage '${stage}'`);
        if (version) {
            console.log(`Pushing version ${version}`);
        }

        try {
            const response = await axios.put(`${serviceUrl}/artifacts/push`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Push Artifact Azure DevOps Task v1.0.0',
                    'Authorization': `Bearer ${apiToken}`,
                }
            });
            if (response.status !== 200) {
                tl.setResult(tl.TaskResult.Failed, `Cannot push artifact '${name}': ${response.data.message}`);
            } else {
                console.log(`Successfully pushed artifact '${name}' version: ${response.data.version}`);
                tl.setVariable('version', response.data.version, false, true);
            }
        } catch (error: any) {
            tl.setResult(tl.TaskResult.Failed, error.response.data.error);
        }
    } catch (err) {
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        } else {
            tl.setResult(tl.TaskResult.Failed, 'Failed to push artifact');
        }
    }
}

run();
