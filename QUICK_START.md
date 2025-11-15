# Quick Start Guide - CPA Dashboard with Authentication

**Get up and running in 5 minutes!** ⚡

---

## 📦 What You Have

A complete CPA performance dashboard with:
- ✅ Member login system
- ✅ Admin panel for member management
- ✅ Performance tracking dashboard
- ✅ Secure authentication

---

## 🚀 Setup (5 Minutes)

### Step 1: Extract Files
Extract `cpa-dashboard-with-auth.tar.gz` to your computer

### Step 2: Install Dependencies
```bash
cd cpa-dashboard
pnpm install
```
*(If you don't have pnpm: `npm install -g pnpm`)*

### Step 3: Create Database
```bash
pnpm run seed
```

### Step 4: Start Servers

**Terminal 1:**
```bash
pnpm run server
```

**Terminal 2:**
```bash
pnpm run dev
```

### Step 5: Open Browser
Go to: **http://localhost:5173**

---

## 🔑 Login Credentials

### Admin Account
- **Email:** admin@fundinginsidersshow.com
- **Password:** CPA100K2025!
- **Access:** Full dashboard + admin panel

### Test Member
- **Email:** chris@fundinginsidersshow.com
- **Password:** TestPass123!
- **Access:** Dashboard only

---

## ✅ Quick Test

1. **Login** with admin credentials
2. **Click "Admin"** button in header
3. **Click "Add New Member"**
4. **Create a test member**
5. **Logout and login** with new member
6. **View dashboard**

**If all this works → You're ready!** ✅

---

## 📚 Full Documentation

- **TESTING_GUIDE.md** - Complete testing checklist
- **README.md** - Full project documentation

---

## 🐛 Problems?

### "pnpm not found"
```bash
npm install -g pnpm
```

### "Port already in use"
```bash
# Kill processes on ports 3001 and 5173
lsof -ti:3001 | xargs kill
lsof -ti:5173 | xargs kill
```

### "Database error"
```bash
# Delete and recreate database
rm server/data/members.db
pnpm run seed
```

---

## 🎯 Next Steps

After testing locally:

1. **Give feedback** - What works? What needs changes?
2. **Google Sheets** - Connect real member data
3. **Deploy to Vercel** - Make it live with custom domain
4. **GHL Portal** - Create member resource hub

---

## 📞 Questions?

Document any issues you find and we'll fix them before deployment!

**Happy Testing! 🚀**

