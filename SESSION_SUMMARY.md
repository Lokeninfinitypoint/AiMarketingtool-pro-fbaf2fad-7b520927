# MarketingTool Phone App - Session Summary
## Date: January 24, 2026

---

## PROJECT OVERVIEW

**Phone App:** React Native / Expo SDK 54
- Location: `/Users/loken/Desktop/MarketingToolApp`
- GitHub: `Lokeninfinitypoint/AiMarketingtool-pro`
- Bundle ID: `pro.marketingtool.app`
- Scheme: `marketingtool://`

**Backend:** Appwrite
- Endpoint: `https://api.marketingtool.pro/v1`
- Project ID: `6952c8a0002d3365625d`
- Database: `marketingtool_db`
- 57 users registered
- Admin: `help@marketingtool.pro`

**AI Backend:** Windmill
- URL: `https://wm.marketingtool.pro`
- Workspace: `marketingtool-pro`
- Token: `FeMBZxek4_UvIVq9PE0m4Y-cPynHTWtLZmiZshBO`
- AI: Claude Opus 4.5

**Web App (SEPARATE):** Next.js at `app.marketingtool.pro` - WORKING ✅
**Marketing Website (SEPARATE):** Django at `marketingtool.pro` - WORKING ✅

---

## ARCHITECTURE (IMPORTANT - DO NOT MIX)

| Service | URL | Purpose |
|---------|-----|---------|
| Marketing Website | marketingtool.pro | Django - Public website |
| Next.js Web App | app.marketingtool.pro | Web dashboard (SEPARATE from phone) |
| Appwrite API | api.marketingtool.pro | Backend for BOTH apps |
| Windmill AI | wm.marketingtool.pro | AI backend for phone app |
| Phone App Auth | auth.marketingtool.pro | OAuth redirect for phone app ONLY |

**CRITICAL:** Phone app and Next.js web app are COMPLETELY SEPARATE. Don't mix configurations.

---

## APPWRITE PLATFORMS

| Type | Name | Hostname/Identifier |
|------|------|---------------------|
| web | Next.js app | app.marketingtool.pro |
| web | Next.js app | marketingtool.pro |
| react-native-android | Android | pro.marketingtool.app |
| react-native-ios | iOS | pro.marketingtool.app |
| web | Mobile Deep Link | marketingtool |
| web | Phone Auth | auth.marketingtool.pro |

---

## OAUTH FLOW FOR PHONE APP

```
1. App opens: https://api.marketingtool.pro/v1/account/sessions/oauth2/google?
   project=6952c8a0002d3365625d
   &success=https://auth.marketingtool.pro/oauth/success
   &failure=https://auth.marketingtool.pro/oauth/failure
   &token=true  ← IMPORTANT: Returns userId and secret in URL

2. User authenticates with Google/Apple/Facebook

3. Appwrite redirects to: https://auth.marketingtool.pro/oauth/success?userId=xxx&secret=xxx

4. Nginx (auth.marketingtool.pro) redirects 302 to: marketingtool://oauth/success?userId=xxx&secret=xxx

5. WebBrowser catches marketingtool:// and returns to app

6. App parses userId & secret, creates Appwrite session
```

---

## NGINX CONFIG (auth.marketingtool.pro)

**Server:** `/etc/nginx/sites-available/auth.marketingtool.pro`

```nginx
server {
    server_name auth.marketingtool.pro;

    location /oauth/success {
        return 302 marketingtool://oauth/success$is_args$args;
    }

    location /oauth/failure {
        return 302 marketingtool://oauth/failure$is_args$args;
    }

    location / {
        proxy_pass http://127.0.0.1:8080;
        # ... proxy settings
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/auth.marketingtool.pro/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/auth.marketingtool.pro/privkey.pem;
}
```

---

## KEY CODE - OAuth Implementation

**File:** `src/services/appwrite.ts`

```typescript
// Google OAuth
const successUrl = 'https://auth.marketingtool.pro/oauth/success';
const failureUrl = 'https://auth.marketingtool.pro/oauth/failure';

// token=true makes Appwrite return userId and secret in redirect URL (needed for mobile)
const oauthUrl = `${APPWRITE_ENDPOINT}/account/sessions/oauth2/google?project=${APPWRITE_PROJECT_ID}&success=${encodeURIComponent(successUrl)}&failure=${encodeURIComponent(failureUrl)}&token=true`;

// Nginx redirects auth.marketingtool.pro/oauth/success → marketingtool://oauth/success
const result = await WebBrowser.openAuthSessionAsync(oauthUrl, 'marketingtool://');
```

---

## KEY CODE - Windmill AI Chat

**File:** `src/screens/chat/ChatScreen.tsx`

```typescript
const WINDMILL_BASE = 'https://wm.marketingtool.pro';
const WINDMILL_WORKSPACE = 'marketingtool-pro';
const WINDMILL_TOKEN = 'FeMBZxek4_UvIVq9PE0m4Y-cPynHTWtLZmiZshBO';

fetch(`${WINDMILL_BASE}/api/w/${WINDMILL_WORKSPACE}/jobs/run_wait_result/p/f/mobile/chat_ai`, {
  headers: { 'Authorization': `Bearer ${WINDMILL_TOKEN}` }
})
```

---

## SSH ACCESS

```bash
ssh root@api.marketingtool.pro
# or
ssh root@31.220.107.19
```

**Appwrite Database:**
```bash
docker exec appwrite-mariadb mysql -u user -ppassword appwrite -e "YOUR_QUERY"
```

**Clear Appwrite Cache (IMPORTANT):**
```bash
docker exec appwrite-redis redis-cli FLUSHALL
docker restart appwrite
```

**Docker Services:**
- appwrite (26 containers)
- windmill (4 containers)
- n8n, nginx-proxy-manager, emby, mariadb

---

## CURRENT STATUS (January 24, 2026)

### WORKING:
- ✅ Next.js web app (app.marketingtool.pro) - OAuth working
- ✅ Marketing website (marketingtool.pro)
- ✅ Appwrite API (api.marketingtool.pro)
- ✅ Windmill AI (wm.marketingtool.pro)
- ✅ DNS for auth.marketingtool.pro → 31.220.107.19
- ✅ Nginx OAuth redirect configured
- ✅ Platform `auth.marketingtool.pro` added to Appwrite Console

### PHONE APP OAUTH STATUS:
- ✅ OAuth URL correct with `&token=true`
- ✅ Appwrite accepts auth.marketingtool.pro (after Redis FLUSHALL)
- ✅ Nginx redirects to marketingtool:// deep link
- ⚠️ NEEDS TESTING: Full OAuth flow with userId/secret in callback

### NOT TESTED:
- Phone app Google login end-to-end
- Phone app Facebook login
- Phone app Apple login

---

## BUILD COMMANDS

```bash
# Start Expo (development)
npx expo start --ios --clear

# Build Android (production)
eas build --platform android --profile production

# Build iOS (after Apple Developer verified)
eas build --platform ios --profile production
```

---

## TROUBLESHOOTING

**OAuth "Invalid URI" error:**
1. Add platform in Appwrite Console → Platforms
2. Flush Redis: `docker exec appwrite-redis redis-cli FLUSHALL`
3. Restart Appwrite: `docker restart appwrite`

**OAuth callback missing userId/secret:**
- Add `&token=true` to OAuth URL
- This makes Appwrite return tokens in redirect URL instead of cookies

**Next.js web app broken:**
- DON'T TOUCH app.marketingtool.pro settings
- Phone app uses auth.marketingtool.pro (separate)

---

## SERVER INFO

- **IP:** 31.220.107.19
- **Hostname:** srv1073584.hstgr.cloud
- **OS:** Ubuntu 24.04 with Appwrite
- **VPS:** Hostinger KVM 8 (8 CPU, 32GB RAM, 400GB)
- **Expiration:** 2026-02-25

---

## FILES MODIFIED THIS SESSION

```
src/services/appwrite.ts - OAuth URLs with auth.marketingtool.pro and &token=true
SESSION_SUMMARY.md - This file
/etc/nginx/sites-available/auth.marketingtool.pro (on server) - OAuth redirects
```

---

## GIT STATUS

Latest commits pushed to `main` branch on GitHub.

---

## NEXT STEPS FOR NEW AGENT

1. **TEST PHONE APP OAUTH** - Tap Google button, verify userId/secret in callback
2. **If OAuth still fails** - Check if `&token=true` is in the URL
3. **If callback missing params** - Check nginx redirect: `curl -I https://auth.marketingtool.pro/oauth/success?test=1`
4. **Submit Android to Play Store** - AAB is ready (versionCode 7)
5. **Build iOS** - After Apple Developer 48h verification

---

## IMPORTANT WARNINGS

1. **NEVER mix phone app and web app configurations**
2. **auth.marketingtool.pro = phone app ONLY**
3. **app.marketingtool.pro = Next.js web app ONLY**
4. **Always flush Redis after adding Appwrite platforms**
5. **User has been working on this 4 months - be careful with changes**

---

*Last updated: January 24, 2026 - OAuth session*
