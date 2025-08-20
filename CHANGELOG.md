# Changelog - Render Deployment & Auth Fixes

## Backend Changes

### ✅ Health Check & Deployment
- **Added `/healthz` endpoint** - Fast, unauthenticated health check for Render
- **Fixed server configuration** - Now listens on `0.0.0.0:$PORT` for proper Render deployment
- **Updated Procfile** - Fixed to use `server.js` instead of `index.js`

### ✅ Authentication Improvements
- **Enhanced token error handling** - Maps Firebase `auth/id-token-expired` to machine-readable response
- **Added structured error responses** - All auth errors now include `code` field for client handling
- **Removed sensitive logging** - No more JWT tokens in server logs

### ✅ Request Logging Security
- **Added request sanitization** - Authorization headers and cookies are redacted in logs
- **Excluded health check from logs** - Reduces noise in production logs
- **Added response time tracking** - Better performance monitoring

### ✅ Service-to-Service Auth
- **Created service auth middleware** - For internal API calls (cron jobs, webhooks)
- **Added API key protection** - Uses `X-API-Key` header for service authentication

## Frontend Changes

### ✅ Token Management
- **Created `apiRequest` utility** - Handles automatic token refresh on 401 responses
- **Updated MyModals component** - Uses new API utility instead of direct fetch calls
- **Added token expiration handling** - Automatically refreshes expired tokens and retries requests

### ✅ Error Handling
- **Improved auth error responses** - Handles `token-expired` vs `unauthorized` differently
- **Added automatic sign-out** - Signs out user if token refresh fails
- **Better error user experience** - More specific error messages

## Configuration & Documentation

### ✅ Deployment Guides
- **RENDER_CONFIG.md** - Complete Render deployment configuration
- **ENV_SETUP.md** - Environment variables setup guide
- **SMOKE_TEST.md** - Comprehensive testing checklist

### ✅ Security Improvements
- **No sensitive data in logs** - Tokens, API keys, and auth headers are redacted
- **Proper error codes** - Machine-readable error responses for better client handling
- **Service isolation** - Separate auth for user requests vs service calls

## Migration Notes

### Backend
1. Deploy with new health check endpoint
2. Update Render health check path to `/healthz`
3. Verify no sensitive data appears in logs
4. Optional: Add `SERVICE_API_KEY` for internal services

### Frontend
1. Update components to use `apiRequest` utility
2. Test token refresh flow
3. Verify automatic sign-out on auth failures

### Render Settings
1. **Health Check Path**: `/healthz`
2. **Start Command**: `npm start`
3. **Build Command**: `npm install`
4. **Environment**: Set all required variables per ENV_SETUP.md

## Testing Checklist
- [ ] Health check responds quickly (< 500ms)
- [ ] Expired tokens trigger automatic refresh
- [ ] Failed refresh signs out user
- [ ] No tokens appear in server logs
- [ ] Service deploys without timeout
- [ ] All API endpoints work with new auth flow