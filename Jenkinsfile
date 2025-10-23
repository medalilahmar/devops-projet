pipeline {
    agent any
    tools {
        maven 'Maven3'
        jdk 'JDK17'
    }
    environment {
        DOCKER_IMAGE = "lahmarali/student-management:${env.BUILD_ID}"
        DOCKER_TAG   = "latest"
        PROJECT_PATH = "/home/medalilahmar/devops-project/student-management"
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/medalilahmar/devops-projet.git'
            }
        }
        stage('Build') {
            steps {
                sh 'mvn clean install -DskipTests'
            }
        }
        stage('Test') {
            steps {
                sh 'mvn test || true'
            }
        }
        stage('Docker Build') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}")
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        docker.image("${DOCKER_IMAGE}").push("${DOCKER_TAG}")
                        docker.image("${DOCKER_IMAGE}").push("${env.BUILD_ID}")
                    }
                }
            }
        }
        stage('Deploy with Ansible') {
            steps {
                script {
                    sh """
                        cd ${PROJECT_PATH}
                        # ✅ SOLUTION DÉFINITIVE - Variable d'environnement
                        ANSIBLE_SSH_PRIVATE_KEY_FILE=/var/lib/jenkins/.ssh/id_rsa \
                        ansible-playbook \
                          -i ansible/inventory.ini \
                          ansible/playbooks/deploy.yaml \
                          -e docker_image=${DOCKER_IMAGE} \
                          -e build_number=${env.BUILD_ID} \
                          -v  # Mode verbose pour voir ce qui se passe
                    """
                }
            }
        }
    }  // ✅ Fermeture CORRECTE du bloc 'stages'
    post {
        always {
            sh 'docker system prune -f --volumes'
        }
        success {
            echo '🎉 DEPLOYMENT SUCCESSFUL!'
            // Optionnel: Notification
            emailext (
                subject: "✅ SUCCESS: Build ${env.BUILD_NUMBER}",
                body: "Application deployed successfully!\nImage: ${DOCKER_IMAGE}",
                to: "votre-email@example.com"
            )
        }
        failure {
            echo '❌ DEPLOYMENT FAILED!'
        }
    }
}
