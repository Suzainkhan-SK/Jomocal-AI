# 🚨 URGENT: Fix Start Command in Render Dashboard

## The Problem
Your Render service is trying to run `dist` as a command, but it should run `npm start`.

**Error you're seeing:**
```
==> Running 'dist'
bash: line 1: dist: command not found
```

## ⚡ IMMEDIATE ACTION REQUIRED

You **MUST** update the Start Command in Render's dashboard. This cannot be fixed through code - it's a Render configuration setting.

### Step-by-Step Instructions:

1. **Open Render Dashboard**
   - Go to: https://dashboard.render.com
   - Sign in if needed

2. **Find Your Service**
   - Look for `jomocal-frontend` in your services list
   - Click on it

3. **Go to Settings**
   - Click **"Settings"** in the left sidebar
   - Scroll down to find **"Build & Deploy"** section

4. **Find "Start Command" Field**
   - Look for a field labeled **"Start Command"**
   - It probably currently says: `dist` ❌

5. **Update the Start Command**
   - **DELETE** whatever is in that field (`dist`)
   - **TYPE**: `npm start`
   - Make sure it says exactly: `npm start` ✅

6. **Save Changes**
   - Scroll to the bottom of the page
   - Click **"Save Changes"** button
   - Wait for confirmation

7. **Trigger Redeploy**
   - After saving, Render should auto-deploy
   - If not, go to **"Manual Deploy"** tab
   - Click **"Deploy latest commit"**

## Visual Guide

```
Render Dashboard → Your Service → Settings Tab

┌─────────────────────────────────────┐
│ Build & Deploy                      │
├─────────────────────────────────────┤
│ Build Command:                      │
│ npm install && npm run build        │
│                                     │
│ Start Command:  ← CHANGE THIS!     │
│ [dist] ❌                          │
│                                     │
│ Should be:                         │
│ [npm start] ✅                      │
└─────────────────────────────────────┘
```

## What to Expect After Fix

Once you update and save, Render will redeploy. In the logs you should see:

```
==> Running 'npm start'
Frontend server running on port XXXX
Serving files from: /opt/render/project/src/dist
```

## Why This Happens

Render's Start Command field might have been auto-filled incorrectly, or you might have accidentally entered `dist` instead of `npm start`. The `dist` folder is where your built files are, but you need to run a command to serve them, which is `npm start`.

## Still Not Working?

If after updating you still see errors:
1. Double-check the Start Command field shows `npm start` (not `dist`)
2. Make sure you clicked "Save Changes"
3. Check that the service type is "Web Service" (not "Static Site")
4. Look at the runtime logs for any other errors
