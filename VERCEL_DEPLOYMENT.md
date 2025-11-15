# Vercel Deployment Guide - CPA Dashboard with Authentication

**Complete step-by-step guide to deploy your dashboard to Vercel with full authentication.**

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free tier is fine)
- ✅ Code tested locally and working

---

## 🚀 Deployment Steps

### Step 1: Push Code to GitHub

**1. Initialize Git repository (if not already done):**
```bash
cd ~/Desktop/cpa-dashboard
git init
```

**2. Add all files:**
```bash
git add .
```

**3. Commit:**
```bash
git commit -m "Add authentication system for production deployment"
```

**4. Add GitHub remote:**
```bash
git remote add origin https://github.com/chrisollinwhite/cpa-club-dashboard.git
```

**5. Push to GitHub:**
```bash
git push -u origin main
```

---

### Step 2: Set Up Vercel Postgres Database

**1. Go to Vercel Dashboard:**
- Visit: https://vercel.com/dashboard
- Log in to your account

**2. Navigate to Storage:**
- Click "Storage" in the left sidebar
- Click "Create Database"

**3. Select Postgres:**
- Choose "Postgres"
- Click "Continue"

**4. Configure Database:**
- **Database Name:** `cpa-dashboard-db`
- **Region:** Choose closest to your users (e.g., US East)
- **Plan:** Hobby (free tier is fine for MVP)
- Click "Create"

**5. Connect to Project:**
- After creation, click "Connect Project"
- Select your `cpa-club-dashboard` project
- Click "Connect"

**6. Note Connection Details:**
- Vercel will automatically add environment variables to your project
- These include: `POSTGRES_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, etc.

---

### Step 3: Deploy to Vercel

**1. Go to Vercel Dashboard:**
- Visit: https://vercel.com/new

**2. Import Git Repository:**
- Click "Import Project"
- Select "Import Git Repository"
- Choose `chrisollinwhite/cpa-club-dashboard`
- Click "Import"

**3. Configure Project:**
- **Framework Preset:** Vite
- **Root Directory:** ./
- **Build Command:** `pnpm run build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

**4. Environment Variables:**
- Vercel will auto-detect the Postgres connection
- Add one more variable:
  - **Name:** `VITE_API_URL`
  - **Value:** `https://dashboard.fundinginsidersshow.com`

**5. Deploy:**
- Click "Deploy"
- Wait 2-3 minutes for deployment

---

### Step 4: Initialize Production Database

**After first deployment, initialize the database:**

**1. Go to Vercel project dashboard**

**2. Click "Settings" → "Functions"**

**3. Create a temporary setup endpoint:**

Create file: `/api/setup.js`
```javascript
import { initDatabase, memberDB } from '../lib/db.js';
import { hashPassword } from '../lib/auth.js';

export default async function handler(req, res) {
  try {
    await initDatabase();
    
    const adminEmail = 'admin@fundinginsidersshow.com';
    const existing = await memberDB.findByEmail(adminEmail);
    
    if (!existing) {
      const hash = await hashPassword('CPA100K2025!');
      await memberDB.create(adminEmail, hash, 'Admin User', true);
    }
    
    res.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
}
```

**4. Visit the setup endpoint ONCE:**
```
https://dashboard.fundinginsidersshow.com/api/setup
```

**5. Delete `/api/setup.js` after use**

---

### Step 5: Update Custom Domain

**1. In Vercel Dashboard:**
- Go to your project
- Click "Settings" → "Domains"

**2. Add Custom Domain:**
- Enter: `dashboard.fundinginsidersshow.com`
- Click "Add"

**3. Configure DNS:**
- Vercel will show you DNS records to add
- Go to your domain registrar
- Add the CNAME record:
  - **Type:** CNAME
  - **Name:** dashboard
  - **Value:** cname.vercel-dns.com

**4. Wait for DNS propagation (5-30 minutes)**

---

### Step 6: Test Production

**1. Visit:** `https://dashboard.fundinginsidersshow.com`

**2. Test login:**
- Email: `admin@fundinginsidersshow.com`
- Password: `CPA100K2025!`

**3. Test admin panel and member creation**

---

## ✅ Post-Deployment Checklist

- [ ] Database initialized
- [ ] Admin login working
- [ ] Admin panel accessible
- [ ] Member creation working
- [ ] Custom domain configured
- [ ] HTTPS enabled
- [ ] Mobile responsive

---

## 🐛 Troubleshooting

### "Database connection failed"
- Check Postgres environment variables in Vercel
- Verify database is connected to project

### "API routes not working"
- Verify `vercel.json` exists
- Check API routes are in `/api` folder
- Redeploy

### "Login not working"
- Check `VITE_API_URL` environment variable
- Verify it matches production domain

---

## 🔄 Future Updates

**To deploy updates:**
1. Make changes locally
2. Commit to Git: `git push`
3. Vercel auto-deploys

---

**Deployment complete!** 🎉

