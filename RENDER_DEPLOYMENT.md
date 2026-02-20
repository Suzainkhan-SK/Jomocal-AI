# Render.com Deployment Guide

This guide will help you deploy both the backend and frontend of your Automation Studio application to Render.com.

## Backend Deployment (Already Completed ✅)

Your backend is already deployed at: `https://jomocal-backend.onrender.com`

## Frontend Deployment Steps

### ⚠️ Important: Use Web Service (Not Static Site)

To fix the 404 error on page refresh, you need to deploy as a **Web Service** instead of a Static Site. This allows proper SPA routing.

### Step 1: Delete Existing Static Site (If Any)

If you already deployed as a Static Site:
1. Go to your Render dashboard
2. Find your frontend service
3. Click on it → Settings → Delete Service

### Step 2: Create a New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** button
3. Select **"Web Service"**

### Step 3: Connect Your Repository

1. Connect your GitHub repository: `https://github.com/Suzainkhan-SK/Jomocal-AI`
2. Render will automatically detect it

### Step 4: Configure Build Settings

Fill in the following settings:

- **Name**: `jomocal-frontend` (or any name you prefer)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty (or `.` if required)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Step 5: Add Environment Variables

Click on **"Environment"** tab and add:

- **Key**: `VITE_API_URL`
- **Value**: `https://jomocal-backend.onrender.com/api`

**Important**: Make sure there's no trailing slash in the URL.

### Step 6: Deploy

1. Click **"Create Web Service"**
2. Render will start building your frontend
3. Wait for the build to complete (usually 2-5 minutes)
4. Your frontend will be available at: `https://jomocal-frontend.onrender.com` (or your custom domain)

### How It Works

The `serve.js` file serves your built static files and handles SPA routing by serving `index.html` for all routes. This ensures that refreshing `/dashboard` or any other route works correctly.

## Post-Deployment Checklist

- [ ] Verify frontend loads correctly
- [ ] Test API connection (check browser console for errors)
- [ ] Test user authentication (signup/login)
- [ ] Verify all API calls work correctly
- [ ] Check CORS settings on backend (should already be configured)

## Troubleshooting

### Issue: Frontend can't connect to backend
**Solution**: 
- Verify `VITE_API_URL` environment variable is set correctly
- Check backend CORS settings allow your frontend domain
- Check browser console for CORS errors

### Issue: Build fails
**Solution**:
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Issue: 404 errors on page refresh
**Solution**: 
- Make sure you're using **Web Service** (not Static Site)
- Verify `serve.js` file exists in your repository
- Check that `npm start` command runs `node serve.js`
- Ensure the build completed successfully (check build logs)

## Backend CORS Configuration

Make sure your backend (`server/server.js`) has CORS configured to allow your frontend domain:

```javascript
app.use(cors({
  origin: [
    'https://jomocal-frontend.onrender.com',
    'http://localhost:5173' // for local development
  ],
  credentials: true
}));
```

## Custom Domain (Optional)

After deployment, you can add a custom domain:
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain and follow DNS configuration instructions

## Environment Variables Reference

### Frontend (.env or Render Environment Variables)
```
VITE_API_URL=https://jomocal-backend.onrender.com/api
```

### Backend (Already configured)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=10000
N8N_WEBHOOK_URL=your_n8n_webhook_url
... (other backend env vars)
```

## Notes

- Render free tier services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid tier for always-on services
- Static sites on Render are always-on even on free tier
