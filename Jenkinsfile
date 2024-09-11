pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/siddhu12980/BlogSpot', branch: 'main'
                sh 'ls' 
            }
        }
        
        stage('Deploy Frontend to EC2') {
            steps {
                sshagent(['your-ssh-key-credential-id']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@ec2-3-111-40-39.ap-south-1.compute.amazonaws.com << EOF
                        # Navigate to the deployment folder on the EC2 instance
                        cd /BlogSpot

                        # Pull the latest changes
                        git pull origin main

                        # Change directory to the frontend folder
                        cd frontend

                        # Install dependencies and build the frontend
                        npm install
                        npm run build

                        # Deploy the built frontend (adjust based on your setup)
                        cp -r build/* /path/to/your/web/server/root/

                        # Restart the web server if necessary
                        sudo systemctl restart nginx
                    EOF
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
    }
}
