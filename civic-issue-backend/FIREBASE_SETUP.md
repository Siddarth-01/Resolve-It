# ===========================================

# FIREBASE SETUP INSTRUCTIONS

# ===========================================

# Step 1: Get your Firebase Project ID

# - Go to Firebase Console > Project Settings

# - Copy the "Project ID"

# Step 2: Generate Service Account Key

# - Go to Firebase Console > Project Settings > Service Accounts

# - Click "Generate new private key"

# - Download the JSON file

# - Copy the ENTIRE JSON content and paste it as one line below

# Step 3: Replace the values below with your actual Firebase details

FIREBASE_PROJECT_ID=resolve-it-12345
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"resolve-it-12345","private_key_id":"abc123def456","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@resolve-it-12345.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40resolve-it-12345.iam.gserviceaccount.com"}

# IMPORTANT NOTES:

# - The JSON must be on a single line (no line breaks)

# - Replace "resolve-it-12345" with your actual project ID

# - Replace the entire JSON with your downloaded service account key

# - Make sure the client_email matches your Firebase project
