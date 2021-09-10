import tl = require('azure-pipelines-task-lib/task');
import axios from 'axios';

type PublishArtifactRequest = {
    stage: String,
    stage_description: String | undefined,
    flow: String | undefined,
    artifact_name: String,
    artifact_description: String | undefined,
    type: String,
    group_id: String | undefined,
    artifact_id: String | undefined,
    version: String,
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

        const stageDescription: string | undefined = tl.getInput('stageDescription', false);
        const name: string | undefined = tl.getInput('name', true);
        if (!name) {
            tl.setResult(tl.TaskResult.Failed, 'Artifact Name is required input');
            return;
        }

        const description: string | undefined = tl.getInput('description', false);
        const flow: string | undefined = tl.getInput('flow', false);

        const type: string | undefined = tl.getInput('type', true);
        if (!type) {
            tl.setResult(tl.TaskResult.Failed, 'Artifact Type is required input');
            return;
        }

        if (['JAR', 'WAR', 'EAR', 'DockerImage'].indexOf(type) === -1) {
            tl.setResult(tl.TaskResult.Failed, 'Incorrect Artifact Type supplied. Accepted values are JAR, WAR, EAR and DockerImage');
            return;
        }

        const groupId: string | undefined = tl.getInput('groupId', false);
        const artifactId: string | undefined = tl.getInput('artifactId', false);
        if (['JAR', 'WAR', 'EAR'].indexOf(type) > -1) {
            if (!groupId || !artifactId) {
                tl.setResult(tl.TaskResult.Failed, 'Group and Artifact IDs are required inputs for the Java artifacts');
                return;
            }
        }

        const version: string | undefined = tl.getInput('version', true);
        if (!version) {
            tl.setResult(tl.TaskResult.Failed, 'Artifact Version is required input');
            return;
        }

        // Build a payload object
        let payload : PublishArtifactRequest = {
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
            payload = {
                ...payload,
                stage_description: stageDescription,
            }
        }

        if (description) {
            payload = {
                ...payload,
                artifact_description: description,
            }
        }

        if (flow) {
            payload = {
                ...payload,
                flow,
            }
        }

        if (groupId) {
            payload = {
                ...payload,
                group_id: groupId,
            }
        }

        if (artifactId) {
            payload = {
                ...payload,
                artifact_id: artifactId,
            }
        }

        try {
            console.log(`Publishing artifact '${name}' details to the ${serviceUrl}`);
            const response = await axios.put(`${serviceUrl}/artifacts/versions`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Publish Artifact Azure DevOps Task v1.0.0',
                    'Authorization': `Bearer ${apiToken}`,
                }
            });
            if (response.status !== 202) {
                tl.setResult(tl.TaskResult.Failed, `Cannot publish artifact '${name}' version: ${response.data.message}`);
            } else {
                console.log(`Successfully published artifact '${name}' version: ${version}`);
            }
        } catch (err: any) {
            tl.setResult(tl.TaskResult.Failed, err.response.data.error);
        }
    } catch (err) {
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        } else {
            tl.setResult(tl.TaskResult.Failed, 'Failed to publish artifact');
        }
    }
}

run();
