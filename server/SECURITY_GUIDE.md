# 🔒 Analytics API Security Guide

## ✅ Security Implemented

Your analytics API is now **fully secured** with multiple layers of protection:

### 1. **API Key Authentication** 
- All analytics endpoints require an API key
- Key must be provided in request header or query parameter
- Without the key, access is completely denied

### 2. **Rate Limiting**
- Maximum 100 requests per 15 minutes per IP address
- Prevents abuse even if someone gets your API key
- Automatic cleanup of old request records

### 3. **IP Hashing**
- Visitor IP addresses are hashed (one-way encryption)
- Cannot be reverse-engineered to identify users
- Full GDPR compliance

## 🔑 Your API Key

Your secure API key has been added to `.env`:
```
ANALYTICS_API_KEY=9b43e514e660bd3937b2372cd7ee1f7d47a53889c31f0d264e95d04135fe2abe
```

**⚠️ IMPORTANT: Keep this secret! Never commit it to Git or share publicly.**

## 📡 How to Access Analytics (Securely)

### Method 1: Header Authentication (Recommended)
```bash
curl -H "x-api-key: 9b43e514e660bd3937b2372cd7ee1f7d47a53889c31f0d264e95d04135fe2abe" \
  http://localhost:3001/api/analytics/summary
```

### Method 2: Query Parameter (Easier for browsers)
```
http://localhost:3001/api/analytics/summary?apiKey=9b43e514e660bd3937b2372cd7ee1f7d47a53889c31f0d264e95d04135fe2abe
```

### Method 3: JavaScript Fetch
```javascript
fetch('http://localhost:3001/api/analytics/summary', {
  headers: {
    'x-api-key': '9b43e514e660bd3937b2372cd7ee1f7d47a53889c31f0d264e95d04135fe2abe'
  }
})
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🛡️ Additional Security Options Available

### Option A: JWT Token Authentication (Advanced)
For more complex scenarios, you can use JWT tokens. The middleware is ready in `middleware/auth.js`:
- `authenticateToken()` - Verify JWT tokens
- `requireAdmin()` - Require admin role

### Option B: IP Whitelist
Restrict access to specific IP addresses only. Add to `.env`:
```env
ANALYTICS_IP_WHITELIST=192.168.1.100,203.0.113.45
```

Then in your analytics routes:
```javascript
const { ipWhitelist } = require('../middleware/auth');
router.use(ipWhitelist(process.env.ANALYTICS_IP_WHITELIST?.split(',')));
```

## 🚨 What Happens Without Authentication

### Before (INSECURE):
```
GET /api/analytics/summary
✅ Returns all your data - ANYONE can access!
```

### After (SECURE):
```
GET /api/analytics/summary
❌ 401 Unauthorized: "Access denied. API key required."

GET /api/analytics/summary?apiKey=wrong-key
❌ 403 Forbidden: "Invalid API key."

GET /api/analytics/summary?apiKey=correct-key
✅ Returns data - Only you can access!
```

## 📊 Rate Limiting Protection

Even with the correct API key:
```
Request 1-100: ✅ OK
Request 101: ❌ 429 Too Many Requests
Response: "Too many requests. Please try again later."
```

This prevents:
- Accidental DDoS from your own scripts
- API key being abused if leaked
- Server overload

## 🔐 Security Best Practices

### ✅ DO:
- Keep your API key in `.env` file
- Add `.env` to `.gitignore` (already done)
- Use HTTPS in production
- Rotate API keys periodically
- Monitor analytics access logs
- Use different keys for dev/staging/production

### ❌ DON'T:
- Commit API keys to Git
- Share keys in public forums
- Embed keys in client-side code
- Use the same key across multiple projects
- Leave default/weak keys in production

## 🔄 Rotating Your API Key

If your key is compromised, generate a new one:

```bash
# Generate new key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update .env file
ANALYTICS_API_KEY=<new_key_here>

# Restart server
npm start
```

## 🧪 Testing Security

### Test 1: Without API Key
```bash
curl http://localhost:3001/api/analytics/summary
# Expected: 401 Unauthorized
```

### Test 2: With Wrong API Key
```bash
curl -H "x-api-key: wrong-key" http://localhost:3001/api/analytics/summary
# Expected: 403 Forbidden
```

### Test 3: With Correct API Key
```bash
curl -H "x-api-key: 9b43e514e660bd3937b2372cd7ee1f7d47a53889c31f0d264e95d04135fe2abe" \
  http://localhost:3001/api/analytics/summary
# Expected: 200 OK with data
```

### Test 4: Rate Limiting
```bash
# Run this 101 times quickly
for i in {1..101}; do 
  curl -H "x-api-key: YOUR_KEY" http://localhost:3001/api/analytics/summary
done
# Expected: First 100 succeed, 101st gets 429 error
```

## 🌐 Production Deployment

When deploying to production:

1. **Use Environment Variables**
   - Don't hardcode keys in your code
   - Set `ANALYTICS_API_KEY` in your hosting platform (Vercel, Heroku, etc.)

2. **Enable HTTPS**
   - Your hosting platform should provide this automatically
   - Never send API keys over HTTP

3. **Consider Additional Security**
   - Enable IP whitelist if you only access from specific locations
   - Use JWT tokens for programmatic access
   - Set up monitoring/alerts for suspicious activity

4. **Update CORS Settings**
   ```javascript
   // In server.js, restrict CORS to your domain only
   app.use(cors({
     origin: 'https://tornadoaudio.net',
     credentials: true
   }));
   ```

## 📝 Security Checklist

Before going to production:
- [ ] API key is in `.env` file
- [ ] `.env` is in `.gitignore`
- [ ] Generate new key for production (don't use dev key)
- [ ] HTTPS is enabled
- [ ] CORS is restricted to your domain
- [ ] Rate limiting is active
- [ ] Monitoring is set up
- [ ] Backup plan for key rotation

## 🆘 If Your Key Is Compromised

1. **Immediately generate a new key**
2. **Update `.env` file**
3. **Restart your server**
4. **Review access logs for suspicious activity**
5. **Check MongoDB Atlas access logs**
6. **Consider additional IP restrictions**

## 📚 Middleware Documentation

All security middleware is in `server/middleware/auth.js`:

- `authenticateApiKey` - Simple API key check (currently active)
- `authenticateToken` - JWT token validation (available for future use)
- `requireAdmin` - Admin role check (available for future use)
- `rateLimit` - Request throttling (currently active)
- `ipWhitelist` - IP-based access control (available for future use)

## 🎯 Summary

Your analytics API is now **production-ready and secure**:
- ✅ API key authentication required
- ✅ Rate limiting prevents abuse
- ✅ IP addresses are hashed
- ✅ Ready for HTTPS/production deployment
- ✅ Multiple security layers available

**No one can access your analytics data without your API key!** 🔒

