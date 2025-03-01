pipeline {

    agent any

    environment {
        DOCKER_IMAGE = 'text-emoji'
        DOCKERFILE_PATH = './Dockerfile'
        PATH = "/usr/local/bin:$PATH"
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

        stage('Run Tests') {  // New Test Stage
            steps {
                script {
                    try {
                        echo "Running tests..."
                        sh 'node -v'  // Ensure Node.js is installed
                        sh 'npm install'  // Install dependencies
                        sh 'npm test'  // Run test cases

                        echo "Tests passed successfully!"
                    } catch (Exception e) {
                        echo "Tests failed: ${e.getMessage()}"
                        currentBuild.result = 'FAILURE'
                        error("Stopping pipeline due to failed tests.")  // Stop pipeline if tests fail
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

        stage('Deploy to Production') {
            steps {
                script {
                    def runningContainer = sh(script: "docker ps -q --filter ancestor=${DOCKER_IMAGE}", returnStdout: true).trim()

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

                    echo "Deploying new container from image: ${DOCKER_IMAGE}"
                    sh 'docker run -d -p 3000:3000 --name dev-ops-proj-container ${DOCKER_IMAGE}'
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
