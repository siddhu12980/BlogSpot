pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Display files in the current workspace (before the git clone)
                sh 'ls'

                // Checkout the Git repository
                git url: 'https://github.com/siddhu12980/BlogSpot', branch: 'main'
                
                // Display files in the current workspace (after the git clone)
                sh 'ls'
            }
        }
    }

    post {
        always {
            // Cleanup, notifications, or any other steps you want to run regardless of success/failure
            echo 'Pipeline completed.'
        }
    }
}
