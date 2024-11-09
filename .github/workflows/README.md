# GitHub Actions Workflow Testing Guide

This guide explains how to test GitHub Actions workflows using [nektos/act](https://github.com/nektos/act).

## Prerequisites

1. **Docker**
    - Install Docker Desktop from [here](https://www.docker.com/products/docker-desktop/)
    - Ensure Docker is running on your machine

2. **Act**
    - Install using your preferred package manager:
    ```bash
    # Windows (Chocolatey)
    choco install act-cli
    # MacOS (Homebrew)
    brew install act
    # Linux (APT)
    curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
    ```
3. **Environment Setup**
    - Create a `.secrets` file in the project root directory with:
    ```plaintext
    CONNECTION_STRING="your_mongo_db_connection_string"
    GITHUB_TOKEN="your_github_token"
    JWT_SECRET="your_jwt_secret"
    ENCRYPTION_KEY="your_encryption_key"
    MY_SECRET_PEPPER="your_secret_pepper"
    NODE_ENV="development"
    ```
    - If you are unsure of where to get these values, use the following links:
        - [MongoDB Connection String](https://www.mongodb.com/docs/manual/reference/connection-string/)
        - [GitHub Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
        - For the JWT_SECRET, ENCRYPTION_KEY, and MY_SECRET_PEPPER, you can generate values using the following command in the root directory with terminal:
        ```bash
        node server/generatecrypto.js
        ```
4. **Event File**
    - Ensure `event.json` is in the root directory.
    ```json
    {
       "push": {
         "ref": "refs/heads/main",
         "head_commit": {
           "id": "test-commit-id"
         },
         "modified": [
           "server/src/app.js",
           "client/src/App.tsx"
         ]
       }
     }
     ```
## Running Workflows Locally

### Basic Usage
```bash
bash
act push \
-W .github/workflows/Testing.yml \
--container-architecture linux/amd64 \
-P ubuntu-latest=catthehacker/ubuntu:act-latest \
--artifact-server-path /tmp/artifacts \
-e event.json \
--secret-file .secrets \
-v \
--bind
```
### Explanation of Command
- `act push`: Simulates a push event to trigger the workflow.
- `-W .github/workflows/Testing.yml`: Specifies the workflow file to run. Replace `workflows/Testing.yml` with the name of the workflow file you want to run including the path.
- `--container-architecture linux/amd64`: Specifies the container architecture.
- `-P ubuntu-latest=catthehacker/ubuntu:act-latest`: Specifies the container image to use.
- `--artifact-server-path /tmp/artifacts`: Specifies the path to store artifacts.
- `-e event.json`: Specifies the event file to use.
- `--secret-file .secrets`: Specifies the secret file to use.
- `-v`: Enables verbose output.
- `--bind`: Binds the container to the host machine.

For additional options, refer to the [Act documentation](https://github.com/nektos/act).

### CodeQL Workflow Testing

To test the CodeQL workflow structure (without actual analysis):

```bash
act push \
  -W .github/workflows/codeql.yml \
  --container-architecture linux/amd64 \
  -P ubuntu-latest=catthehacker/ubuntu:act-latest \
  --artifact-server-path /tmp/artifacts \
  -e event.json \
  --secret-file .secrets \
  -v \
  --bind \
  -j analyze \
  --env CODEQL_ACTION_EXTRA_OPTIONS='{"database":{"run-queries":"false"}}'
```

Note: Local CodeQL testing has limitations:
- The CodeQL binary isn't available in local containers
- Full analysis requires GitHub's infrastructure
- SARIF results upload requires GitHub API access
- Only dependency installation and environment setup can be tested locally

## Troubleshooting

### Common Issues

1. **Docker Container Not Running**:
    ```bash
    Error: Cannot connect to the Docker daemon. Is the docker daemon running?
    ```
    - Ensure Docker is running on your machine by running `docker ps` in terminal or opening Docker Desktop.

2. **Architecture Mismatch**:
    ```bash
    Error: The architecture linux/amd64 is not supported for this platform.
    ```
    - Ensure you are using the correct architecture.
    ```bash
    # For MacOS running on Apple Silicon add the following flag
    --container-architecture arm64

    # For Windows add the following flag
    --platform windows/amd64

    # For Linux add the following flag  
    --platform linux/amd64
    ```

3. **Missing Secrets**:
    ```bash
    Error: Error loading secrets: open .secrets: no such file or directory
    ```
    - Ensure the `.secrets` file is in the root directory. Refer to the [Environment Setup](#environment-setup) section for more information.

4. **Missing Event File**:
    ```bash
    Error: Error loading event: open event.json: no such file or directory
    ```
    - Ensure the `event.json` file is in the root directory. Refer to the [Event File](#event-file) section for more information.

5. **Permissions Issue**:
    ```bash
    Error: Error loading secrets: open .secrets: permission denied
    ```
    Solution: Run `chmod +x` on necessary files or used sudo (e.g. `sudo chmod +x .secrets`)

6. **CodeQL Analysis Failure**:
    ```bash
    Error: Job 'Analyze' failed
    ```
    Solutions:
    - CodeQL requires GitHub's infrastructure for full analysis
    - Locally, you can only test the workflow structure and dependency setup
    - Add these to your `.secrets` file for basic testing:
    ```plaintext
    GITHUB_TOKEN="your_github_token"
    CODEQL_DEFAULT_RAM="6144"
    ```
    - For full CodeQL analysis, push to GitHub and let it run on GitHub Actions

### GitHub-Specific Features

Some features that require GitHub's infrastructure won't work locally:
- GitHub token authentication
- GitHub App integrations
- Some GitHub Actions marketplace actions

## Notes
- Local runs might behave slightly differently from GitHub-hosted runners.
- Some environment variables are only available in the GitHub Actions runner environment.
- Performance may vary based on your machine's capabilities. I ran this on an M2
Pro Mac Mini with 10 cores and 16GB of RAM. Some tests took 10+ minutes to complete, some took 10 seconds.
- Some GitHub-specific features are automatically skipped when running locally

## Additional Resources

- [Act Documentation](https://github.com/nektos/act#readme)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
    

### Running Specific Workflows

#### 1. Testing Workflow (Testing.yml)
```bash
# Run all jobs
act push \
  -W .github/workflows/Testing.yml \
  --container-architecture linux/amd64 \
  -P ubuntu-latest=catthehacker/ubuntu:act-latest \
  --artifact-server-path /tmp/artifacts \
  -e event.json \
  --secret-file .secrets \
  -v \
  --bind

# Run specific jobs (e.g., only dependencies and tests)
act push \
  -W .github/workflows/Testing.yml \
  --container-architecture linux/amd64 \
  -P ubuntu-latest=catthehacker/ubuntu:act-latest \
  --artifact-server-path /tmp/artifacts \
  -e event.json \
  --secret-file .secrets \
  -v \
  --bind \
  -j dependencies \
  -j tests
```

#### 2. Deployment Workflow (main.yml)
```bash
# Run all jobs
act push \
  -W .github/workflows/main.yml \
  --container-architecture linux/amd64 \
  -P ubuntu-latest=catthehacker/ubuntu:act-latest \
  --artifact-server-path /tmp/artifacts \
  -e event.json \
  --secret-file .secrets \
  -v \
  --bind

# Run specific jobs (e.g., only dependencies and security-checks)
act push \
  -W .github/workflows/main.yml \
  --container-architecture linux/amd64 \
  -P ubuntu-latest=catthehacker/ubuntu:act-latest \
  --artifact-server-path /tmp/artifacts \
  -e event.json \
  --secret-file .secrets \
  -v \
  --bind \
  -j dependencies \
  -j security-checks
```

### Required Secrets for Workflows
For both workflows to run successfully, ensure your `.secrets` file contains:

```plaintext
# Required for both workflows
CONNECTION_STRING="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret"
ENCRYPTION_KEY="your_encryption_key"
MY_SECRET_PEPPER="your_secret_pepper"
GITHUB_TOKEN="your_github_token"

# Additional secrets for main.yml
SNYK_TOKEN="your_snyk_token"  # Required for security checks in main.yml
```

### Known Limitations

1. **Deployment Steps**: 
   - The actual deployment steps in main.yml will not execute locally
   - The "Deploy to Server" step needs to be modified for local testing

2. **Security Checks**:
   - Snyk security checks require a valid SNYK_TOKEN
   - Some security checks might not work properly in local environment

3. **Bundle Analysis**:
   - The bundle analysis job requires specific Node.js setup
   - Some build tools might need additional configuration for local testing

### Workflow-Specific Issues

#### Testing.yml
- The test reporter action might not work locally
- ESLint results might need local path adjustments
- Bundle analysis might require additional setup

#### main.yml
- Deployment steps should be skipped for local testing
- Security checks might need modified configuration
- Cache actions might behave differently locally

### Modified Commands for Local Testing

#### Testing.yml (Skip GitHub-specific steps)
```bash
act push \
  -W .github/workflows/Testing.yml \
  --container-architecture linux/amd64 \
  -P ubuntu-latest=catthehacker/ubuntu:act-latest \
  --artifact-server-path /tmp/artifacts \
  -e event.json \
  --secret-file .secrets \
  -v \
  --bind \
  --env ACT=true
```

#### main.yml (Skip deployment)
```bash
act push \
  -W .github/workflows/main.yml \
  --container-architecture linux/amd64 \
  -P ubuntu-latest=catthehacker/ubuntu:act-latest \
  --artifact-server-path /tmp/artifacts \
  -e event.json \
  --secret-file .secrets \
  -v \
  --bind \
  --env ACT=true \
  -j dependencies \
  -j build-and-deploy
```

### Additional Troubleshooting

7. **Snyk Security Check Failures**:
    ```bash
    Error: Failed to run Snyk security check
    ```
    Solutions:
    - Ensure SNYK_TOKEN is properly set in .secrets
    - Try running Snyk locally first: `npx snyk test`
    - For local testing, you might want to skip Snyk checks

8. **Bundle Analysis Failures**:
    ```bash
    Error: Process completed with exit code 1
    ```
    Solutions:
    - Ensure all build dependencies are installed
    - Check if build:analyze script exists in package.json
    - Modify bundle size limits for local testing

9. **Deployment Step Failures**:
    ```bash
    Error: Deployment step failed
    ```
    Solutions:
    - Skip deployment steps when testing locally
    - Create mock deployment commands for testing
    - Use conditional steps based on environment
