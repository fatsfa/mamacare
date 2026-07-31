# 🚀 MamaCare Deployment Guide

## Overview

| Part | Platform | Free Tier |
|------|----------|-----------|
| Full app (Express + React build) | [Render](https://render.com) | ✅ Yes |
| Database | [MongoDB Atlas](https://cloud.mongodb.com) | ✅ Yes |

---

## Step 1 — Prepare GitHub

Push your code to GitHub first (if not already done):

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## Step 2 — Deploy the Express App to Render

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **New → Web Service**
3. Connect your GitHub repo → select `mamacare`
4. Configure:
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
5. Add **Environment Variables:**
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_strong_secret_key
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key
   ```
6. Click **Deploy**
7. Wait for deployment → copy the URL: `https://YOUR_APP.onrender.com`
8. Test: visit `https://YOUR_APP.onrender.com/health` — should return `{"status":"OK"}`

---

## Step 3 — Smoke Test the Live App

Go through this checklist on the live app:
- [ ] Register a new account
- [ ] Add a baby
- [ ] Log a feeding
- [ ] Log a diaper change
- [ ] Check vaccine schedule
- [ ] Ask AI a question
- [ ] View Stats page
- [ ] Read an article

---

## MongoDB Atlas Network Access

Make sure your Atlas cluster allows connections from Render:
1. Go to MongoDB Atlas → **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0) for deployment
4. Save

---

## Environment Variables Summary

### server/.env (local)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
PORT=5000
GEMINI_API_KEY=your_key
```

### client/.env (local)
```
VITE_API_BASE_URL=http://localhost:5000
```

### client/.env.production (Render)
```
VITE_API_BASE_URL=https://YOUR_APP.onrender.com
```
