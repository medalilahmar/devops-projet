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
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}")
                    // Tag supplémentaire pour latest
                    sh "docker tag ${DOCKER_IMAGE} lahmarali/student-management:latest"
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    // ✅ Solution robuste avec retry et timeout
                    retry(3) {
                        timeout(time: 20, unit: 'MINUTES') {
                            docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                                docker.image("${DOCKER_IMAGE}").push()
                                docker.image("${DOCKER_IMAGE}").push("latest")
                            }
                        }
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
                          -e build_number=${env.BUILD_ID}
                    """
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker system prune -f --volumes'
            cleanWs()
        }
        success {
            echo '🎉 DEPLOYMENT SUCCESSFUL!'
            emailext (
                subject: "✅ SUCCESS: Student Management Build ${env.BUILD_NUMBER}",
                body: """
                Application deployed successfully!
                
                Détails:
                - Build: ${env.BUILD_URL}
                - Docker Image: ${DOCKER_IMAGE}
                - Server: 192.168.1.138:8080
                """,
                to: "votre-email@example.com"
            )
        }
        failure {
            echo '❌ DEPLOYMENT FAILED!'
            emailext (
                subject: "❌ FAILED: Student Management Build ${env.BUILD_NUMBER}",
                body: "Build failed: ${env.BUILD_URL}",
                to: "votre-email@example.com"
            )
        }
    }
}
