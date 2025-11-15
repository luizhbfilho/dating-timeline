# Firebase Troubleshooting Guide

If you're getting "Error saving presentation" when trying to save, follow these steps:

## Step 1: Check Browser Console

1. Open your browser (Chrome/Firefox)
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try saving a presentation again
5. Look for error messages in the console

## Step 2: Verify Environment Variables

Make sure your `.env.local` file has all 6 Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dating-timeline-b9e5f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dating-timeline-b9e5f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dating-timeline-b9e5f.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1059951932368
NEXT_PUBLIC_FIREBASE_APP_ID=1:1059951932368:web:e49fc168c3a8c66e03bfd5
```

**Important:** After editing `.env.local`, restart the dev server:
```bash
npm run dev
```

## Step 3: Check Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. Make sure it says **"Ready"** (not "Creating" or "Deleting")

## Step 4: Check Firestore Security Rules

1. In Firestore, go to **Rules** tab
2. Make sure your rules allow read/write:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /presentations/{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish** if you made changes

## Step 5: Check Network Tab

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Try saving a presentation
4. Look for failed requests (red)
5. Click on failed requests to see error details

## Common Errors & Solutions

### "Firebase is not initialized"
- **Cause:** Environment variables not loaded
- **Solution:** 
  1. Check `.env.local` has all 6 variables
  2. Restart dev server: `npm run dev`
  3. Hard refresh browser: Ctrl+Shift+R

### "Permission denied"
- **Cause:** Firestore security rules don't allow access
- **Solution:**
  1. Go to Firestore Rules
  2. Replace with rules above
  3. Click Publish

### "CORS error"
- **Cause:** Firebase domain not whitelisted
- **Solution:**
  1. Go to Firebase Console
  2. Settings → Authorized domains
  3. Add `localhost:3002` (or your port)

### "Collection not found"
- **Cause:** Firestore database not created
- **Solution:**
  1. Go to Firestore Database
  2. Click "Create database"
  3. Choose "Start in test mode"
  4. Select region and create

## Quick Checklist

- [ ] `.env.local` has all 6 Firebase variables
- [ ] Dev server restarted after `.env.local` changes
- [ ] Firestore Database is "Ready"
- [ ] Firestore Rules allow read/write
- [ ] Browser console shows no errors
- [ ] Network tab shows successful requests

## Still Having Issues?

1. **Check the browser console** - Look for specific error messages
2. **Check Firebase Console** - Make sure database is ready
3. **Restart everything:**
   ```bash
   npm run dev
   ```
4. **Clear browser cache:**
   - Ctrl+Shift+Delete (Windows)
   - Cmd+Shift+Delete (Mac)

## Test Firebase Connection

Try this in browser console:

```javascript
// Check if Firebase is loaded
console.log(typeof firebase);

// Check environment variables
console.log(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
```

## Contact Firebase Support

If nothing works:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Support** → **Contact Support**
3. Describe your issue

---

**Note:** The current setup is for development. For production, implement proper authentication and security rules.
