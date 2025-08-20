# Smoke Test Checklist

## Backend Health Checks

### Basic Connectivity
- [ ] `GET /healthz` returns 200 with `{"status":"ok","timestamp":"..."}`
- [ ] Health check responds in <500ms
- [ ] Server starts without errors in logs
- [ ] MongoDB connection established

### Authentication Flow
- [ ] `POST /api/auth/login` with valid credentials returns token
- [ ] `POST /api/auth/google` with valid Google token works
- [ ] `GET /api/auth/me` with valid token returns user data
- [ ] `GET /api/auth/me` with expired token returns 401 with `code: "token-expired"`
- [ ] `GET /api/auth/me` without token returns 401 with `code: "unauthorized"`

### API Endpoints
- [ ] `GET /api/rentals` returns rental listings (no auth required)
- [ ] `GET /api/services` returns service listings (no auth required)
- [ ] `GET /api/rentals/user` requires authentication
- [ ] `POST /api/rentals` requires authentication

### Security
- [ ] No tokens/JWTs appear in server logs
- [ ] Authorization headers are redacted in request logs
- [ ] Health check endpoint bypasses auth middleware

## Frontend Checks

### Authentication
- [ ] Login form works with email/password
- [ ] Google sign-in works on web
- [ ] Google sign-in works on mobile (Capacitor)
- [ ] Token refresh happens automatically on 401 responses
- [ ] User is signed out after failed token refresh

### API Integration
- [ ] My Items page loads user's rentals/services
- [ ] Creating new rental/service works
- [ ] Editing items works
- [ ] Deleting items works
- [ ] Status toggle works for rentals/services

### Error Handling
- [ ] Network errors show user-friendly messages
- [ ] Auth errors redirect to login
- [ ] Expired token errors trigger automatic refresh

## Mobile App (Capacitor)

### Authentication
- [ ] Google sign-in uses native plugin
- [ ] Firebase auth state persists across app restarts
- [ ] Token refresh works in background

### API Calls
- [ ] All API calls use the new `apiRequest` utility
- [ ] Network errors are handled gracefully
- [ ] App works offline for cached data

## Production Deployment

### Render Backend
- [ ] Service deploys without timeout
- [ ] Health check passes in Render dashboard
- [ ] Environment variables are set correctly
- [ ] Logs show no sensitive information

### Render Frontend
- [ ] Static site builds and deploys
- [ ] Environment variables are set
- [ ] App loads and functions correctly

## Performance
- [ ] Health check responds in <500ms
- [ ] API responses are <2s for typical requests
- [ ] Frontend loads in <3s on 3G connection
- [ ] Images load progressively with placeholders