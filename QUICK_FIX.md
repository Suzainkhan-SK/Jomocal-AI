# Quick Fix for 404 Errors on Page Refresh

## ⚠️ CRITICAL: You MUST Use Web Service (Not Static Site)

The 404 errors happen because **Static Sites** on Render don't support server-side routing. You **MUST** deploy as a **Web Service** for this to work.

## Step-by-Step Fix

### 1. Check Your Current Deployment Type

Go to your Render dashboard and check:
- If it says **"Static Site"** → You need to delete and recreate as Web Service
- If it says **"Web Service"** → Check the configuration below

### 2. Delete Existing Static Site (If Applicable)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Find `jomocal-frontend` service
3. Click on it → **Settings** → Scroll down → **Delete Service**
4. Confirm deletion

### 3. Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect repository: `https://github.com/Suzainkhan-SK/Jomocal-AI`
3. Configure:
   ```
   Name: jomocal-frontend
   Region: (choose closest)
   Branch: main
   Root Directory: (leave empty)
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```
4. Add Environment Variable:
   ```
   Key: VITE_API_URL
   Value: https://jomocal-backend.onrender.com/api
   ```
5. Click **"Create Web Service"**

### 4. Verify Files Are Committed

Make sure these files are in your GitHub repository:
- ✅ `serve.js` (exists)
- ✅ `package.json` with `"start": "node serve.js"` (updated)

### 5. Check Build Logs

After deployment starts, check the build logs:
- Should see: `npm install && npm run build`
- Should see: `vite build` running
- Should see: `dist` folder created

### 6. Check Runtime Logs

After build completes, check runtime logs:
- Should see: `Frontend server running on port XXXX`
- Should see: `Serving files from: /opt/render/project/src/dist`

## Verification Checklist

- [ ] Service type is **Web Service** (not Static Site)
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Environment variable `VITE_API_URL` is set
- [ ] `serve.js` file exists in repository
- [ ] `package.json` has `"start": "node serve.js"`
- [ ] Build logs show successful build
- [ ] Runtime logs show server starting

## Still Not Working?

If you've done all the above and it's still not working:

1. **Check Render Logs**: Look for any errors in the runtime logs
2. **Verify serve.js is running**: Check logs for "Frontend server running on port"
3. **Test locally**: Run `npm run build && npm start` locally to verify it works
4. **Check dist folder**: Make sure `dist/index.html` exists after build

## Common Issues

### Issue: "Cannot find module 'express'"
**Solution**: Make sure `express` is in `dependencies` (not `devDependencies`)

### Issue: "Cannot find module './serve.js'"
**Solution**: Make sure `serve.js` is in the root directory and committed to Git

### Issue: Still getting 404s
**Solution**: 
- Double-check you're using **Web Service**, not Static Site
- Verify `npm start` command is `node serve.js`
- Check that build completed successfully (dist folder exists)
