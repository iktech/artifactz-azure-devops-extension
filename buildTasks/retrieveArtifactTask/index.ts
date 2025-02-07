import tl = require('azure-pipelines-task-lib/task');
import axios, { AxiosProxyConfig, AxiosRequestConfig, AxiosResponse } from 'axios';

type Version = {
    artifact_name: string,
    artifact_description: string,
    type: string,
    flow_id: number,
    group_id: string,
    artifact_id: string,
    version: string,
}

type RetrieveArtifactsResponse = {
    stage: string
    artifacts: Version[],
}

type ErrorResponse = {
    error: String,
}

async function run() {
    try {
        // Validate inputs
        let serviceUrl: string | undefined = tl.getInput('serviceUrl', false);
        if (!serviceUrl) {
            serviceUrl = 'https://api.artifactz.io';
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

        console.log(`Retrieving artifact details from the stage '${stage}'`);
        try {
            let config : AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Retrieve Artifact Azure DevOps Task v1.1.1',
                    'Authorization': `Bearer ${apiToken}`,
                }
            };

            if (proxy) {
                config = {
                    ...config,
                    proxy: proxy,
                }
            };

            let response : AxiosResponse<RetrieveArtifactsResponse> | AxiosResponse<ErrorResponse> = await axios.get(`${serviceUrl}/stages/${stage}/list?artifact=${artifact}`, config);

            if (response.status !== 200) {
                tl.setResult(tl.TaskResult.Failed, `Cannot retrieve artifact version: ${(response.data as ErrorResponse).error}`);
            } else {
                console.log(`Successfully retrieved artifact version from the server`);
                const responseData : RetrieveArtifactsResponse = response.data as RetrieveArtifactsResponse;
                let data = ""
                if (responseData.artifacts && responseData.artifacts.length === 1) {
                    data = responseData.artifacts[0].version;
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
