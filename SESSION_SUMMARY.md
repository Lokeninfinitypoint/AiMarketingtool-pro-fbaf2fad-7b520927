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

**AI Backend:** Windmill
- URL: `https://wm.marketingtool.pro`
- Workspace: `marketingtool-pro`
- AI: Claude Opus 4.5

**Web App (SEPARATE):** Next.js at `app.marketingtool.pro`
**Marketing Website (SEPARATE):** Django at `marketingtool.pro`

---

## ARCHITECTURE (IMPORTANT - DO NOT MIX)

| Service | URL | Purpose |
|---------|-----|---------|
| Marketing Website | marketingtool.pro | Django - Public website |
| Next.js Web App | app.marketingtool.pro | Web dashboard (SEPARATE from phone) |
| Appwrite API | api.marketingtool.pro | Backend for BOTH apps |
| Windmill AI | wm.marketingtool.pro | AI backend for phone app |

**CRITICAL:** Phone app and Next.js web app are COMPLETELY SEPARATE. Don't mix configurations.

---

## CURRENT STATUS

### COMPLETED:
1. ✅ Android build SUCCESS (versionCode 7) - AAB ready for Play Store
2. ✅ iOS build PENDING (waiting Apple Developer 48h verification)
3. ✅ Dashboard fixed: 206+ AI tools
4. ✅ Hero banner added with AI robot image
5. ✅ All navigation buttons working
6. ✅ Notification bell navigates to History
7. ✅ Chat connected to Windmill AI (Claude Opus 4.5)
8. ✅ Removed unused native modules

### OAUTH FIX (THIS SESSION):
1. ✅ Removed invalid `scopes` parameter from Google/Facebook OAuth URLs
2. ✅ Added `marketingtool` platform to Appwrite via SSH (ID: 17)
3. ✅ Platform allows `marketingtool://` deep link callbacks

---

## APPWRITE PLATFORMS (via SSH)

```sql
SELECT _id, type, name, hostname FROM _console_platforms;
```

| ID | Type | Name | Hostname |
|----|------|------|----------|
| 2 | web | Next.js app | app.marketingtool.pro |
| 3 | web | Next.js app | marketingtool.pro |
| 10 | react-native-android | Android | (bundle: pro.marketingtool.app) |
| 14 | react-native-ios | iOS | (bundle: pro.marketingtool.app) |
| 17 | web | Mobile Deep Link | marketingtool |

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

**Docker Services:**
- appwrite (26 containers)
- windmill (4 containers)
- n8n, nginx-proxy-manager, emby, mariadb

---

## FILES MODIFIED THIS SESSION

```
src/services/appwrite.ts - Removed scopes from OAuth URLs
SESSION_SUMMARY.md - This file
```

---

## GIT COMMITS THIS SESSION

1. `45b4146` - Fix OAuth scopes error for phone app
2. `dbf334d` - Revert (temporary)
3. `eef22c8` - Fix OAuth (reverted)
4. Previous commits for dashboard fixes

---

## KEY CODE - OAuth Implementation

**File:** `src/services/appwrite.ts`

```typescript
// Google OAuth (NO scopes parameter)
const oauthUrl = `${APPWRITE_ENDPOINT}/account/sessions/oauth2/google?project=${APPWRITE_PROJECT_ID}&success=${encodeURIComponent(successUrl)}&failure=${encodeURIComponent(failureUrl)}`;

// Success/Failure URLs use deep link scheme
const successUrl = 'marketingtool://oauth/success';
const failureUrl = 'marketingtool://oauth/failure';
```

---

## KEY CODE - Windmill AI Chat

**File:** `src/screens/chat/ChatScreen.tsx`

```typescript
const WINDMILL_BASE = 'https://wm.marketingtool.pro';
const WINDMILL_WORKSPACE = 'marketingtool-pro';
const WINDMILL_TOKEN = 'wm_token_marketingtool_2024';

fetch(`${WINDMILL_BASE}/api/w/${WINDMILL_WORKSPACE}/jobs/run_wait_result/p/f/mobile/chat_ai`, {
  headers: { 'Authorization': `Bearer ${WINDMILL_TOKEN}` }
})
```

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

## NEXT STEPS

1. Test Google OAuth on phone simulator (should work now)
2. Test Facebook OAuth
3. Test Apple OAuth (iOS only)
4. Submit Android build to Play Store internal testing
5. Build iOS when Apple Developer verified

---

## IMPORTANT NOTES

1. **Phone app and Web app are SEPARATE** - never mix configurations
2. **Same Appwrite backend** for both apps
3. **Platform `marketingtool` (ID: 17)** enables deep link OAuth callbacks
4. **Windmill AI** powers the phone app chat (Claude Opus 4.5)
5. **12 testers** already added to Play Store internal testing

---

## TROUBLESHOOTING

**OAuth "Invalid scopes" error:**
- Remove `&scopes=...` from OAuth URL
- Use Appwrite's default scopes

**OAuth "Invalid URI" error:**
- Add platform with hostname `marketingtool` to Appwrite
- Via SSH: `INSERT INTO _console_platforms ...`

**OAuth "Provider disabled" error:**
- Check Appwrite Console → Auth → Providers
- Restart: `docker restart appwrite`

---

## SERVER INFO

- **IP:** 31.220.107.19
- **Hostname:** srv1073584.hstgr.cloud
- **OS:** Ubuntu 24.04 with Appwrite
- **VPS:** Hostinger KVM 8 (8 CPU, 32GB RAM, 400GB)
- **Expiration:** 2026-02-25

---

*Last updated: January 24, 2026 - OAuth fix session*
