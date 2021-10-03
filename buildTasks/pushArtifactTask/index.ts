import tl = require('azure-pipelines-task-lib/task');
import axios, { AxiosProxyConfig, AxiosRequestConfig } from 'axios';

type PushArtifactRequest = {
    stage_name: String,
    artifact_name: String,
    version: String | undefined,
};

type ErrorResponse = {
    error: String,
}

async function run() {
    try {
        // Validate inputs
        let serviceUrl: string | undefined = tl.getInput('serviceUrl', false);
        if (!serviceUrl) {
            serviceUrl = 'https://artifactor.artifactz.io';
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
        let proxyUrl: string | undefined = tl.getInput('proxyUrl', false);
        let proxyUsername: string | undefined = tl.getInput('proxyUsername', false);
        let proxyPassword: string | undefined = tl.getInput('proxyPassword', false);
        let proxy : AxiosProxyConfig | undefined = undefined;
        if (proxyUrl) {
            const proxyObject = new URL(proxyUrl);
            proxy = {
                protocol: proxyObject.protocol,
                host: proxyObject.hostname,
                port: +proxyObject.port,
            };
            if (proxyUsername || proxyPassword) {
                proxy = {
                    ...proxy,
                    auth: {
                        username: proxyUsername as string,
                        password: proxyPassword as string,
                    }
                }
            }
        }

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
            let config : AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Publish Artifact Azure DevOps Task v1.0.1',
                    'Authorization': `Bearer ${apiToken}`,
                }
            };

            if (proxy) {
                config = {
                    ...config,
                    proxy: proxy,
                }
            };

            const response = await axios.put(`${serviceUrl}/artifacts/push`, payload, config);
            if (response.status !== 200) {
                tl.setResult(tl.TaskResult.Failed, `Cannot push artifact '${name}': ${response.data.message}`);
            } else {
                console.log(`Successfully pushed artifact '${name}' version: ${response.data.version}`);
                tl.setVariable('version', response.data.version, false, true);
            }
        } catch (error: any) {
            console.log(error);
            tl.setResult(tl.TaskResult.Failed, error.response.data.error);
        }
    } catch (err) {
        console.log(err);
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        } else {
            tl.setResult(tl.TaskResult.Failed, 'Failed to push artifact');
        }
    }
}

run();
