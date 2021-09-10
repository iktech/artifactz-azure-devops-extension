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

        const artifactsString: string | undefined = tl.getInput('artifacts', true);
        if (!artifactsString) {
            tl.setResult(tl.TaskResult.Failed, 'Artifacts is required input');
            return;
        }

        let artifacts: string[];
        let params : string;

        try {
            artifacts = JSON.parse(artifactsString);
            params = artifacts.map(n => `artifact=${n}`).join('&');
        } catch (e) {
            params = `artifact=${artifactsString}`;
        }

        console.log(`Retrieving artifact details from the stage '${stage}'`);

        try {
            let response = await axios.get(`${serviceUrl}/stages/${stage}/list?${params}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Retrieve Artifacts Azure DevOps Task v1.0.0',
                    'Authorization': `Bearer ${apiToken}`,
                }
            });
            if (response.status !== 200) {
                tl.setResult(tl.TaskResult.Failed, `Cannot retrieve artifacts: ${response.data.message}`);
            } else {
                console.log(`Successfully retrieved artifacts from the server`);
                let data: any = {}
                if (response.data.artifacts) {
                    response.data.artifacts.forEach((item: { artifact_name: string, type: string, group_id: string, artifact_id: string, version: string }) => {
                        data[item.artifact_name] = item.version;
                    });
                }
                tl.setVariable('artifacts', JSON.stringify(data), false, true);
            }
        } catch(error: any) {
            tl.setResult(tl.TaskResult.Failed, error.response.data.error);
        }
    }
    catch (err) {
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        } else {
            tl.setResult(tl.TaskResult.Failed, 'Failed to retrieve artifacts versions');
        }
    }
}

run();
