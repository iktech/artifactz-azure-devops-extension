# Artifactz.io Azure DevOps Extension 

This extension allows to interact with the artifactz.io services from the Azure DevOps build and deployment pipelines.

This extension provides the following three tasks:

## `publish-artifact`
The task publishes the artifact version to the https://artifactz.io.
If the specified stage does not exist, it will be created.
If artifact does not exist, it will be created. If it exists it will be modified using the information supplied with
the action.

## Inputs
### `serviceUrl`
**Required** The URL of the artifactz.io service.
*Default:* https://api.artifactz.io

### `apiToken`
**Required** The API token with write permissions

### `stage`
**Required** Stage where artifact is getting published

### `stageDescription`
Stage description

### `name`
**Required** Name of the artifact to publish

### `description`
Description of the artifact that is getting published

### `flow`
Name of the flow that will be associated with the artifact

### `type`
**Required** Artifact type. Accepted values `JAR`, `WAR`, `EAR`, `DockerImage`

### `groupId`
The maven group Id for the Java artifacts

### `artifactId`
The maven artifact Id for the java artifacts'

### `version`
**Required** The artifact version to publish

## Example
Before adding this task to your pipeline, set a secret with the API token in your project.
Then, you can publish the artifact details using this task:
```yaml
- task: publish-artifact@1
  inputs:
    serviceUrl: 'https://api.uat.artifactz.io'
    apiToken: '<api-token>'
    stage: 'Development'
    flow: 'Test'
    name: 'test-data'
    type: 'JAR'
    groupId: 'io.iktech.test'
    artifactId: 'test-data'
    version: '1.0.0'
```

## `push-artifact`
This task pushes the artifact version to the next stage of the flow at the https://artifactz.io.
If version is omitted, then current version from the specified stage is getting pushed.

## Inputs
### `serviceUrl`
**Required** The URL of the artifactz.io service.
*Default:* https://api.artifactz.io

### `apiToken`
**Required** The API token with write permissions

### `stage`
**Required** Stage where artifact is getting pushed from

### `name`
**Required** Name of the artifact to push

### `version`
The artifact version to push

## Outputs
### `version`
The version of the artifact that was pushed

## Example
Before adding this task to your pipeline, set a secret with the API token in your project.
Then, you can push the artifact details using this task:
```yaml
- task: push-artifact@1
  name: pushArtifact
  inputs:
    serviceUrl: 'https://api.uat.artifactz.io'
    apiToken: '<api-token>'
    stage: 'Development'
    name: 'test-data'
```
You can get the version of the pushed artifact by using the output variable `$(<taskName>.version)`.
For example:
```yaml
- script: echo $(pushArtifact.version)
```

## `retrieve-artifacts`
This action retrieves artifacts' versions from the specified stage at the https://artifactz.io.

## Inputs
### `serviceUrl`
**Required** The URL of the artifactz.io service.
*Default:* https://api.artifactz.io

### `apiToken`
**Required** The API token with write permissions

### `stage`
**Required** Stage from which task retrieves artifacts' versions

### `artifacts`
**Required** Names of the artifacts to retrieve. It is a string parameter, which could be a name of the single artifact or the list of the artifacts,
presented in the form of JSON array. For example, if the value represents a single artifact it looks like this 'test-data'. When the list of artifact names is passed it 
will look like this: '["test-data", "test-app"]'

## Outputs
### `artifacts`
The retrieved artifacts details in the JSON format, for example:
```json
{
  "test-data": "1.0.0.3",
  "test-app": "1.0.1.2"
}
```

## Example
Before adding this task to your pipeline, set a secret with the API token in your project.
Then, you can retrieve the artifact details using this task:
```yaml
- task: retrieve-artifacts@1
  name: retrieveArtifacts
  inputs:
    serviceUrl: 'https://api.uat.artifactz.io'
    apiToken: '<api-token>'
    stage: 'Development'
    artifacts: 'test-data'
```
You can get the artifact details by using the output variable `$(<taskName>.artifacts)`.
For example:
```yaml
- script: echo $(retrieveArtifacts.artifacts)
```
The value is the stringified JSON object. 

## `retrieve-artifact`
This action retrieves a single artifact details from the specified stage at the https://artifactz.io.

## Inputs
### `serviceUrl`
**Required** The URL of the artifactz.io service.
*Default:* https://api.artifactz.io

### `apiToken`
**Required** The API token with write permissions

### `stage`
**Required** Stage from which task retrieves the artifact version

### `artifact`
**Required** Names of the artifact to retrieve

## Outputs
### `version`
The artifact version

## Example
Before adding this task to your pipeline, set a secret with the API token in your project.
Then, you can retrieve the artifact details using this task:
```yaml
- task: retrieve-artifact@1
  name: retrieveArtifact
  inputs:
    serviceUrl: 'https://api.uat.artifactz.io'
    apiToken: '<api-token>'
    stage: 'Development'
    artifact: 'test-data'
```
You can get the artifact details by using the output variable `$(<taskName>.version)`.
For example:
```yaml
- script: echo $(retrieveArtifact.version)
```
The value is the version string. For example: "1.0.2.0".
