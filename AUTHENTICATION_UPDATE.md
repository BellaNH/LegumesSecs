# Authentication & Authorization Security Updates

## Changes Implemented

### Backend Changes

1. **Token Refresh Mechanism**
   - Updated JWT settings to enable token rotation
   - Access token lifetime: 60 minutes (was 3000 minutes)
   - Refresh token lifetime: 7 days (was 1 day)
   - Token rotation enabled for better security

2. **Rate Limiting**
   - Added `django-ratelimit` package
   - Login endpoint: 5 attempts per minute per IP
   - Password reset: 5 attempts per hour per IP
   - Prevents brute force attacks

3. **Logout Endpoint**
   - New `/api/logout/` endpoint
   - Blacklists refresh tokens on logout
   - Properly invalidates sessions

4. **Password Reset Security**
   - Fixed bug in ResetPasswordView (was using wrong User model)
   - Added password length validation (minimum 8 characters)
   - Rate limited to prevent abuse

5. **Token Blacklist**
   - Added `rest_framework_simplejwt.token_blacklist` to INSTALLED_APPS
   - Enables proper token invalidation

### Frontend Changes

1. **Token Storage**
   - Now stores both access and refresh tokens
   - Access token: `localStorage.getItem("token")`
   - Refresh token: `localStorage.getItem("refreshToken")`

2. **Auto Token Refresh**
   - Axios interceptor automatically refreshes expired tokens
   - Seamless user experience - no forced logouts
   - Handles 401 errors gracefully

3. **Improved Logout**
   - Calls backend logout endpoint
   - Clears both tokens from storage
   - Proper cleanup

4. **Password Reset Fix**
   - Fixed hardcoded localhost URL
   - Now uses environment URL from context
   - Better error handling

5. **Error Handling**
   - Better error messages
   - Handles rate limiting errors
   - User-friendly feedback

## Migration Steps

1. **Install new package:**
   ```bash
   cd backend
   pip install django-ratelimit==4.1.0
   ```

2. **Run migrations for token blacklist:**
   ```bash
   python manage.py migrate
   ```

3. **Update environment variables** (if needed):
   - No new variables required, but you can add rate limiting configs

## Testing

1. **Test login rate limiting:**
   - Try logging in 6 times quickly
   - Should see rate limit error after 5 attempts

2. **Test token refresh:**
   - Login and wait for token to expire (or manually expire it)
   - Make an API call - should auto-refresh

3. **Test logout:**
   - Login, then logout
   - Try using old token - should be rejected

4. **Test password reset:**
   - Try resetting password more than 5 times per hour
   - Should see rate limit error

## Security Improvements

- ✅ Token rotation enabled
- ✅ Rate limiting on sensitive endpoints
- ✅ Token blacklisting on logout
- ✅ Shorter access token lifetime
- ✅ Automatic token refresh
- ✅ Better password validation

## Notes

- Access tokens expire after 60 minutes
- Refresh tokens expire after 7 days
- Old refresh tokens are automatically rotated
- Rate limits reset after the time window expires










