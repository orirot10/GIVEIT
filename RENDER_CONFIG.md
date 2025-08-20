# Render Configuration Guide

## Backend Service Settings

### Build & Deploy
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: Node

### Health Check
- **Health Check Path**: `/healthz`
- **Health Check Grace Period**: 60 seconds

### Environment Variables
Ensure these are set in Render dashboard:
- `NODE_ENV=production`
- `PORT=5000` (or leave empty to use Render's default)
- `MONGO_URI=your_mongodb_connection_string`
- `FIREBASE_SERVICE_ACCOUNT=your_firebase_service_account_json`
- `JWT_SECRET=your_jwt_secret`
- `API_URL=https://your-backend-service.onrender.com`
- `FRONTEND_URL=https://your-frontend-service.onrender.com`

### Auto-Deploy
- Enable auto-deploy from your main branch
- Deploy on push to main branch

## Frontend Service Settings

### Build & Deploy
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment**: Static Site

### Environment Variables
- `VITE_API_URL=https://your-backend-service.onrender.com`

## Troubleshooting

### Deploy Timeouts
- Health check endpoint `/healthz` should respond quickly
- Ensure server listens on `0.0.0.0:$PORT`
- Check build logs for errors

### Auth Issues
- Verify Firebase service account JSON is properly formatted
- Check that tokens are not being logged in production
- Ensure auth middleware handles expired tokens correctly

### Performance
- Enable compression in production
- Use proper caching headers for static assets
- Monitor response times via health check logs