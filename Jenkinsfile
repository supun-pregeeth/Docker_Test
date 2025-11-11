pipeline {
    agent any

    environment {
        // Docker Hub credentials ID in Jenkins (you need to create this in Jenkins)
        DOCKERHUB_CREDENTIALS = 'dockerhub-credentials-id'  
        
        // Docker Hub username
        DOCKERHUB_USERNAME = 'eg245453'
        
        // Full image names with tags
        FRONTEND_IMAGE = "eg245453/my-react-frontend:latest"
        BACKEND_IMAGE = "eg245453/my-react-backend:latest"
    }

    stages {

        stage('Checkout') {
            steps {
                // Pull the project from GitHub
                git branch: 'master', url: 'https://github.com/supun-pregeeth/Docker_Test.git'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    echo "Building frontend image..."
                    docker.build("${FRONTEND_IMAGE}", "./frontend")
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    echo "Building backend image..."
                    docker.build("${BACKEND_IMAGE}", "./backend")
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKERHUB_CREDENTIALS}") {
                        echo "Logged in to Docker Hub"
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKERHUB_CREDENTIALS}") {
                        echo "Pushing frontend image..."
                        docker.image("${FRONTEND_IMAGE}").push()
                        
                        echo "Pushing backend image..."
                        docker.image("${BACKEND_IMAGE}").push()
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Docker images built and pushed successfully!"
        }
        failure {
            echo "❌ Build failed!"
        }
    }
}
