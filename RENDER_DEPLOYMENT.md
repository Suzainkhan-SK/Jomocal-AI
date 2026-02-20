# Render.com Deployment Guide

This guide will help you deploy both the backend and frontend of your Automation Studio application to Render.com.

## Backend Deployment (Already Completed ✅)

Your backend is already deployed at: `https://jomocal-backend.onrender.com`

## Frontend Deployment Steps

### Step 1: Create a New Static Site on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** button
3. Select **"Static Site"**

### Step 2: Connect Your Repository

1. Connect your GitHub repository: `https://github.com/Suzainkhan-SK/Jomocal-AI`
2. Render will automatically detect it

### Step 3: Configure Build Settings

Fill in the following settings:

- **Name**: `jomocal-frontend` (or any name you prefer)
- **Branch**: `main`
- **Root Directory**: Leave empty (or `.` if required)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### Step 4: Add Environment Variable

Click on **"Environment"** tab and add:

- **Key**: `VITE_API_URL`
- **Value**: `https://jomocal-backend.onrender.com/api`

**Important**: Make sure there's no trailing slash in the URL.

### Step 5: Deploy

1. Click **"Create Static Site"**
2. Render will start building your frontend
3. Wait for the build to complete (usually 2-5 minutes)
4. Your frontend will be available at: `https://jomocal-frontend.onrender.com` (or your custom domain)

## Alternative: Using Web Service (If Static Site Doesn't Work)

If you encounter issues with static site deployment, you can deploy as a Web Service:

### Configuration:
- **Name**: `jomocal-frontend`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: Leave empty

### Environment Variables:
- `VITE_API_URL`: `https://jomocal-backend.onrender.com/api`
- `PORT`: `10000` (or let Render assign automatically)

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
- This is normal for SPAs - Render static sites handle this automatically
- If using Web Service, you may need to configure routing

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
