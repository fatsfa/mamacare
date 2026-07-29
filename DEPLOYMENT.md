# 🚀 DEPLOYMENT GUIDE - MamaCare

This guide covers deploying MamaCare to Render (backend) and Vercel (frontend).

---

## **Part 1: Deploy Backend to Render**

### Step 1: Prepare Repository
1. Push all code to GitHub (or Render-compatible git host)
2. Ensure `server/.env` has all required variables set
3. Commit: `git push`

### Step 2: Create Render Account & Project
1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Select GitHub repository (connect GitHub account if needed)
4. Choose the repo with your MamaCare backend

### Step 3: Configure Backend Deployment
1. **Name:** `mamacare-api` (or your choice)
2. **Environment:** `Node`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start` (or `node index.js`)
5. **Publish directory:** Leave empty (backend only)

### Step 4: Set Environment Variables
1. In Render dashboard, go to Environment section
2. Add these variables:
   ```
   MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/mamacare?retryWrites=true&w=majority
   JWT_SECRET=your_production_secret_key_minimum_32_characters
   NODE_ENV=production
   ```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (2-5 minutes)
3. You'll get a URL like: `https://mamacare-api-xxxxx.onrender.com`
4. **Save this URL** - you'll need it for frontend

### Step 6: Test Backend
```bash
curl https://mamacare-api-xxxxx.onrender.com/health
```
Should return: `{"status":"OK","message":"Server is running",...}`

---

## **Part 2: Deploy Frontend to Vercel**

### Step 1: Prepare Frontend
1. Update `client/.env.production`:
   ```
   VITE_API_BASE_URL=https://mamacare-api-xxxxx.onrender.com
   ```

2. Update frontend to use environment variable in API calls.
   Example in `client/src/api.js` or components:
   ```javascript
   const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
   
   fetch(`${API_BASE}/api/babies`);
   ```

### Step 2: Create Vercel Account
1. Go to https://vercel.com and sign up
2. Connect your GitHub account

### Step 3: Deploy to Vercel
1. Click "New Project"
2. Select your MamaCare GitHub repository
3. Vercel auto-detects Vite + React setup
4. Under "Build & Development Settings":
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Step 4: Add Environment Variables
1. Before deploying, add environment:
   ```
   VITE_API_BASE_URL=https://mamacare-api-xxxxx.onrender.com
   ```

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build (1-3 minutes)
3. You'll get URL like: `https://mamacare-xxxxx.vercel.app`

### Step 6: Test Frontend
1. Open `https://mamacare-xxxxx.vercel.app` in browser
2. Register → Add Baby → Create Log
3. Should work end-to-end with production backend

---

## **Part 3: Post-Deployment Checklist**

- [ ] Backend health check: `/health` endpoint returns 200
- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can add baby
- [ ] Can create log
- [ ] Can view vaccines
- [ ] Can read articles
- [ ] Can ask AI questions
- [ ] CORS works (no blocked requests)
- [ ] JWT tokens work correctly
- [ ] MongoDB connection is live

---

## **Part 4: Update Production URLs**

### After Deployment, Update:

1. **Backend `.env`** (already set on Render):
   ```
   NODE_ENV=production
   MONGO_URI=your_atlas_uri
   JWT_SECRET=your_production_secret
   ```

2. **Frontend environment** (already set on Vercel):
   ```
   VITE_API_BASE_URL=https://mamacare-api-xxxxx.onrender.com
   ```

3. **Client API calls** - Ensure using `VITE_API_BASE_URL`:
   ```javascript
   const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
   
   // Usage in components:
   fetch(`${API}/api/auth/login`, {...})
   ```

---

## **Part 5: Monitoring & Maintenance**

### Check Render Logs
1. Render Dashboard → Select mamacare-api
2. Logs tab shows real-time server output
3. Watch for errors/crashes

### Check Vercel Analytics
1. Vercel Dashboard → Select mamacare
2. Analytics tab shows requests, errors, performance

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **CORS error** | Check backend CORS settings. Should allow vercel.app domain |
| **503 Service Unavailable** | Backend crashed. Check Render logs. Redeploy if needed |
| **API calls fail** | Check VITE_API_BASE_URL is correct. Check network tab in DevTools |
| **Database connection error** | Verify MONGO_URI on Render. Check MongoDB Atlas IP whitelist |
| **Build fails on Vercel** | Run `npm run build` locally to check for errors |

---

## **Part 6: Custom Domain (Optional)**

### Add Custom Domain to Vercel
1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., mamacare.com)
3. Follow DNS setup instructions

### Add Custom Domain to Render
1. Render Dashboard → Settings → Custom Domains
2. Add domain → Follow DNS setup

---

## **Production Checklist**

Before going live:

- [ ] Environment variables set on both Render + Vercel
- [ ] HTTPS enabled (automatic on both platforms)
- [ ] CORS configured for production domains
- [ ] Error logging set up
- [ ] Database backups enabled on MongoDB Atlas
- [ ] Rate limiting considered for API
- [ ] Input validation on all endpoints
- [ ] Sensitive data (passwords, tokens) never logged
- [ ] Security headers configured
- [ ] Tests pass locally and in CI/CD (if set up)

---

## **Next Steps**

1. **Real AI Integration:** Replace mock AI with Gemini/OpenAI API
2. **Photo Upload:** Add Cloudinary or AWS S3 integration
3. **Email Notifications:** Vaccine reminders via email
4. **Push Notifications:** Mobile notifications for logs
5. **Performance:** Add caching, CDN, database optimization
6. **Analytics:** Track user behavior, feature usage
7. **A/B Testing:** Test UI/UX variations
8. **Security:** Regular security audits, penetration testing

---

**Happy deploying! 🚀**

For support:
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Express + MongoDB: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs
- React + Vite: https://vitejs.dev/guide/
