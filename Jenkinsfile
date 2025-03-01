pipeline {

    agent any

    environment {
        DOCKER_IMAGE = 'text-emoji'
        DOCKER_REPO = 'vardhan1125/text-emoji'  // Updated Docker Hub repo
        DOCKERFILE_PATH = './Dockerfile'
        PATH = "/usr/local/bin:$PATH"
        AWS_LAMBDA_API = 'https://zftkby3wv6.execute-api.eu-north-1.amazonaws.com/update-lambda-image'  // Replace with actual API Gateway URL
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'master', url: 'https://github.com/YashVMishra/Text-to-Emoji-E-D.git'
            }
        }

        stage('Check Docker Version') {
            steps {
                script {
                    sh 'docker --version'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    try {
                        echo "Running tests..."
                        sh 'node -v'
                        sh 'npm install'
                        sh 'npm test'
                        echo "Tests passed successfully!"
                    } catch (Exception e) {
                        echo "Tests failed: ${e.getMessage()}"
                        currentBuild.result = 'FAILURE'
                        error("Stopping pipeline due to failed tests.")
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    try {
                        echo "Building Docker image: ${DOCKER_IMAGE}"
                        docker.build(DOCKER_IMAGE)
                    } catch (Exception e) {
                        echo "Error while building Docker image: ${e.getMessage()}"
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }

        stage('Push to Docker Hub') {   // New Stage
            steps {
                script {
                    echo "Logging in to Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB_CREDENTIALS', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}"
                    }

                    echo "Tagging and pushing Docker image..."
                    sh "docker tag ${DOCKER_IMAGE} ${DOCKER_REPO}:latest"
                    sh "docker push ${DOCKER_REPO}:latest"
                }
            }
        }

        stage('Trigger AWS Lambda Deployment') {
            steps {
                script {
                    echo "Triggering AWS Lambda function to pull the latest image..."
                    sh """
                    curl -X POST "${AWS_LAMBDA_API}" \
                    -H "Content-Type: application/json" \
                    -d '{}'
                    """
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    def runningContainer = sh(script: "docker ps -q --filter ancestor=${DOCKER_REPO}:latest", returnStdout: true).trim()

                    if (runningContainer) {
                        echo "Stopping and removing the existing container: ${runningContainer}"
                        sh "docker stop ${runningContainer}"
                        sh "docker rm ${runningContainer}"
                    }

                    def existingNamedContainer = sh(script: "docker ps -aq -f name=dev-ops-proj-container", returnStdout: true).trim()

                    if (existingNamedContainer) {
                        echo "Removing existing container 'dev-ops-proj-container'."
                        sh "docker rm -f ${existingNamedContainer}"
                    }

                    echo "Deploying new container from image: ${DOCKER_REPO}:latest"
                    sh "docker run -d -p 3000:3000 --name dev-ops-proj-container ${DOCKER_REPO}:latest"
                }
            }
        }

    }

    post {
        success {
            echo 'Build and Deployment Successful!'
        }

        failure {
            echo 'Build Failed!'
        }
    }

}
