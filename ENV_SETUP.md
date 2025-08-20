# Environment Variables Setup

## Backend (.env)

### Required Variables
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Server
NODE_ENV=production
PORT=5000
API_URL=https://your-backend.onrender.com
FRONTEND_URL=https://your-frontend.onrender.com

# Authentication
JWT_SECRET=your-super-secret-jwt-key
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# Service-to-Service (Optional)
SERVICE_API_KEY=your-internal-api-key-for-cron-jobs
```

### Firebase Service Account
The `FIREBASE_SERVICE_ACCOUNT` should be a JSON string containing your Firebase service account credentials. In Render, paste the entire JSON object as the value.

### Security Notes
- Never commit `.env` files to version control
- Use strong, unique values for `JWT_SECRET` and `SERVICE_API_KEY`
- Rotate secrets if they may have been exposed

## Frontend (.env.local, .env.production)

### Required Variables
```env
# API Configuration
VITE_API_URL=https://your-backend.onrender.com

# Firebase Configuration (from Firebase Console)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Render Configuration

### Backend Service
Set these in Render Dashboard > Service > Environment:
- All backend variables from above
- Ensure `FIREBASE_SERVICE_ACCOUNT` is properly formatted JSON

### Frontend Service
Set these in Render Dashboard > Service > Environment:
- All frontend variables from above
- Variables are automatically injected during build

## Local Development

### Backend
1. Copy `backend/.env.example` to `backend/.env`
2. Fill in your local values
3. Use development Firebase project for testing

### Frontend
1. Copy `frontend/.env.example` to `frontend/.env.local`
2. Fill in your local values
3. Point `VITE_API_URL` to your local backend (http://localhost:5000)

## Security Checklist
- [ ] No secrets in version control
- [ ] Strong JWT secret (32+ characters)
- [ ] Firebase service account has minimal permissions
- [ ] API keys are rotated regularly
- [ ] Environment-specific configurations are isolated