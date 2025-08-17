# HabitFlow Deployment Guide

Your HabitFlow app is ready to deploy! Here are the easiest deployment options:

## Option 1: Vercel (Recommended - Easiest)

1. **Create a Vercel account**: Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. **Import your project**:
   - Click "New Project"
   - Import from Git repository or upload your project folder
3. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist/client`
   - Install Command: `npm install`
4. **Deploy**: Click "Deploy" and wait ~2 minutes

**Your URL will be**: `https://your-project-name.vercel.app`

## Option 2: Netlify

1. **Create account**: Go to [netlify.com](https://netlify.com) and sign up
2. **Deploy**:
   - Drag and drop your `dist/client` folder (after running `npm run build`)
   - Or connect your Git repository
3. **Your URL will be**: `https://amazing-site-name.netlify.app`

## Option 3: Cloudflare Pages

1. **Create account**: Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. **Connect Git** or upload project files
3. **Build settings**:
   - Build command: `npm run build`
   - Build output: `dist/client`

## After Deployment

✅ Your PWA will automatically work once deployed:
- Install prompts on mobile/desktop
- Offline functionality 
- Home screen shortcuts
- App-like experience

## Backend Setup (Required)

Your app needs environment variables for the backend:
- `MOCHA_USERS_SERVICE_API_KEY`
- `MOCHA_USERS_SERVICE_API_URL`

**For Vercel/Netlify**: Add these in your dashboard under Environment Variables
**Values**: Contact support@getmocha.com for your API credentials

## Need Help?

If you run into any issues, just ask and I'll help troubleshoot the deployment!
