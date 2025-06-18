# Firebase Deployment Troubleshooting

## Common Firebase Initialization Issues

### 1. "Cannot find module 'firebase-admin'"

**Solution:**
- Make sure `firebase-admin` is in your package.json dependencies
- Run `npm install` locally to update package-lock.json
- Commit and push the updated files
- Redeploy your application

### 2. "The default Firebase app does not exist"

**Solution:**
- Check that your FIREBASE_SERVICE_ACCOUNT environment variable is properly formatted:
  - Must be a valid JSON string
  - All newlines in the private key must be escaped as `\\n`
  - No line breaks in the environment variable value
  
- Verify the format with this command in your terminal:
  ```
  echo $FIREBASE_SERVICE_ACCOUNT | jq .
  ```
  
- If using Render or similar platforms, make sure to:
  1. Format the JSON as a single line
  2. Escape all newlines in the private key with `\\n`
  3. Remove any actual line breaks in the environment variable value

### 3. Service Account Format

The service account in your environment variable should look like:

```
{"type":"service_account","project_id":"your-project","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n","client_email":"firebase-adminsdk@your-project.iam.gserviceaccount.com",...}
```

Note the `\\n` escaping in the private key.

### 4. Testing Firebase Locally

To test your Firebase configuration locally:

1. Create a `.env` file with your Firebase configuration
2. Run your server with `npm run dev`
3. Check the console for Firebase initialization messages

### 5. Deployment Environment Variables

When deploying to platforms like Render:

1. Go to your service's Environment settings
2. Add the FIREBASE_SERVICE_ACCOUNT as a secret environment variable
3. Make sure to format it as a single-line JSON string with escaped newlines
4. Add other Firebase environment variables (FIREBASE_DATABASE_URL, etc.)
5. Redeploy your application

### 6. Fallback Configuration

If you're still having issues, the updated firebase.js file includes fallback mechanisms to prevent crashes, but authentication functionality will be limited until the Firebase configuration is properly set up.