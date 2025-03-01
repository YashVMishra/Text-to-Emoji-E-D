pipeline {

    agent any
 
    environment {

        // Set your Docker image name here

        DOCKER_IMAGE = 'text-emoji'

        DOCKERFILE_PATH = './Dockerfile'  // Path to your Dockerfile

        PATH = "/usr/local/bin:$PATH"  // Add Docker path to Jenkins environment

        }
 
    stages {

        stage('Clone Repository') {

            steps {

                // Clone the repository containing your Flask app

                git branch: 'master', url: 'https://github.com/YashVMishra/Text-to-Emoji-E-D.git'

            }

        }

         stage('Check Docker Version') {

            steps {

                script {

                    // Verify Docker installation

                    sh 'docker --version'

                }

            }

        }
 
        stage('Build Docker Image') {

            steps {

                script {

                    // Build the Docker image from the Dockerfile

                    try {

                        // Build the Docker image from the Dockerfile and capture logs

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

                    // Check if a container from the image is already running

                    def runningContainer = sh(script: "docker ps -q --filter ancestor=${DOCKER_IMAGE}", returnStdout: true).trim()
 
                    if (runningContainer) {

                        echo "Stopping and removing the existing container: ${runningContainer}"

                        sh "docker stop ${runningContainer}"

                        sh "docker rm ${runningContainer}"

                    }
 
                    // Check if a container with the name dev-ops-proj-container already exists

                    def existingNamedContainer = sh(script: "docker ps -aq -f name=dev-ops-proj-container", returnStdout: true).trim()
 
                    if (existingNamedContainer) {

                        echo "A container with the name 'dev-ops-proj-container' already exists. Removing it."

                        sh "docker rm -f ${existingNamedContainer}" // Force remove if it's stopped

                    }
 
                    // Deploy the new container

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
 
