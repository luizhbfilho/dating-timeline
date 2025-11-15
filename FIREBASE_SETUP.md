# Firebase Setup Guide

This guide will help you set up Firebase to save and persist your presentations.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter your project name (e.g., "Anniversary Timeline")
4. Click **"Continue"**
5. Disable Google Analytics (optional)
6. Click **"Create project"**
7. Wait for the project to be created

## Step 2: Create a Web App

1. In the Firebase Console, click the **Web icon** (</>) to create a web app
2. Enter your app name (e.g., "Anniversary Timeline Web")
3. Click **"Register app"**
4. Copy the Firebase configuration (you'll need this)

## Step 3: Get Your Firebase Credentials

From the Firebase config, you'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456",
};
```

## Step 4: Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase credentials:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

## Step 5: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select your region
5. Click **"Create"**

## Step 6: Set Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace the rules with:

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

**Note:** This allows anyone to read/write. For production, implement proper authentication.

## Step 7: Install Dependencies

```bash
npm install
```

## Step 8: Restart the Server

```bash
npm run dev
```

## Step 9: Test Firebase Connection

1. Create a presentation with slides
2. Click **"Save All"** button
3. You should see a "Saving..." message
4. Check Firebase Console → Firestore to verify data is saved

## Features

### Save Presentation
- Click **"Save All"** to save your presentation to Firebase
- Presentations are stored with title, slides, and timestamps

### Load Presentations
- Presentations are automatically loaded when you visit the site
- You can view all saved presentations

### Update Presentation
- Edit slides and click **"Save All"** again
- Your presentation will be updated

### Delete Presentation
- Delete presentations from the list

## Troubleshooting

### "Firebase is not initialized"
- Make sure `.env.local` is filled with correct credentials
- Restart the development server

### "Permission denied" error
- Check Firestore security rules
- Make sure rules allow read/write access

### Data not saving
- Check browser console for errors
- Verify Firebase credentials in `.env.local`
- Check Firestore Database connection

## Security Notes

⚠️ **Important:** The current setup allows anyone to read/write data. For production:

1. Implement user authentication
2. Set up proper security rules
3. Use environment variables for sensitive data
4. Never commit `.env.local` to version control

## Next Steps

1. Set up user authentication (Firebase Auth)
2. Implement user-specific presentations
3. Add sharing features
4. Set up proper security rules
5. Deploy to production

---

For more help, visit [Firebase Documentation](https://firebase.google.com/docs)
