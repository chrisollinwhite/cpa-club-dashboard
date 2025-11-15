# Testing Guide - CPA Dashboard with Authentication

**Version:** MVP 1.0  
**Date:** November 15, 2025  
**Status:** Ready for Local Testing

---

## 🎯 What's Been Built

You now have a complete member authentication system with:

✅ **Login System** - Email/password authentication  
✅ **Member Dashboard** - Protected performance dashboard  
✅ **Admin Panel** - Manage members, reset passwords, toggle status  
✅ **Session Management** - Secure cookie-based sessions  
✅ **Database** - SQLite with members and sessions tables  

---

## 📋 Prerequisites

Before testing, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **pnpm** - Install with: `npm install -g pnpm`
- **Git** (optional) - To clone from GitHub

---

## 🚀 Setup Instructions

### Step 1: Download the Code

**Option A: From GitHub**
```bash
git clone https://github.com/chrisollinwhite/cpa-club-dashboard.git
cd cpa-club-dashboard
```

**Option B: From ZIP file**
1. Extract the ZIP file
2. Open terminal/command prompt
3. Navigate to the extracted folder

---

### Step 2: Install Dependencies

```bash
pnpm install
```

This will install all required packages (React, Express, SQLite, etc.)

---

### Step 3: Initialize Database

```bash
pnpm run seed
```

This creates the database and adds test accounts:

**Admin Account:**
- Email: `admin@fundinginsidersshow.com`
- Password: `CPA100K2025!`

**Test Member Account:**
- Email: `chris@fundinginsidersshow.com`
- Password: `TestPass123!`

---

### Step 4: Start the Servers

**Terminal 1 - Start Backend:**
```bash
pnpm run server
```

You should see:
```
✅ Database initialized successfully
🚀 Server running on port 3001
📊 Dashboard API ready
```

**Terminal 2 - Start Frontend:**
```bash
pnpm run dev
```

You should see:
```
VITE v6.3.5  ready in 550 ms
➜  Local:   http://localhost:5173/
```

---

## 🧪 Testing Checklist

### Test 1: Login as Member

1. **Open browser:** http://localhost:5173
2. **You should see:** Login page with navy blue background
3. **Enter credentials:**
   - Email: `chris@fundinginsidersshow.com`
   - Password: `TestPass123!`
4. **Click:** "Sign In"
5. **Expected result:** Redirected to dashboard showing Chris White's performance metrics

**✅ Success indicators:**
- Dashboard loads
- Header shows "Welcome back, Chris White"
- All charts and metrics display
- Logout button visible

---

### Test 2: Logout

1. **Click:** "Logout" button in header
2. **Expected result:** Redirected back to login page
3. **Try accessing:** http://localhost:5173/dashboard
4. **Expected result:** Automatically redirected to login

**✅ Success indicators:**
- Logout works
- Protected routes require login
- Session cleared properly

---

### Test 3: Login as Admin

1. **Go to:** http://localhost:5173/login
2. **Enter credentials:**
   - Email: `admin@fundinginsidersshow.com`
   - Password: `CPA100K2025!`
3. **Click:** "Sign In"
4. **Expected result:** Dashboard loads with "Admin" button in header

**✅ Success indicators:**
- Dashboard loads
- "Admin" button visible in header
- Can access admin panel

---

### Test 4: Admin Panel - View Members

1. **Click:** "Admin" button in header
2. **Expected result:** Admin panel showing list of members
3. **You should see:**
   - Admin User (admin@fundinginsidersshow.com)
   - Chris White (chris@fundinginsidersshow.com)
   - Status indicators (green checkmark = active)
   - Action buttons for each member

**✅ Success indicators:**
- Both members listed
- Status shows correctly
- Action buttons visible

---

### Test 5: Admin Panel - Add New Member

1. **Click:** "Add New Member" button
2. **Fill in form:**
   - Full Name: `Test CPA`
   - Email: `test@example.com`
   - Password: `TestPass123!`
   - Admin privileges: Leave unchecked
3. **Click:** "Create Member"
4. **Expected result:** Success message, new member appears in list

**✅ Success indicators:**
- Member created successfully
- Appears in members list
- Can log in with new credentials

---

### Test 6: Admin Panel - Reset Password

1. **Find a member** in the list
2. **Click:** Reset password button (🔄 icon)
3. **Enter new password:** `NewPass123!`
4. **Click:** OK
5. **Expected result:** Success message
6. **Test:** Log out and log in with new password

**✅ Success indicators:**
- Password reset successful
- Can log in with new password
- Old password no longer works

---

### Test 7: Admin Panel - Toggle Status

1. **Find Chris White** in members list
2. **Click:** "Deactivate" button
3. **Expected result:** Status changes to inactive (red X)
4. **Log out and try to log in** as Chris White
5. **Expected result:** Error message "Account is inactive"
6. **Reactivate** the account
7. **Test login again**

**✅ Success indicators:**
- Status toggles correctly
- Inactive accounts cannot log in
- Reactivation works

---

### Test 8: Admin Panel - Delete Member

1. **Create a test member** (if you haven't already)
2. **Click:** Delete button (🗑️ icon) for test member
3. **Confirm deletion**
4. **Expected result:** Member removed from list
5. **Try to log in** with deleted member credentials
6. **Expected result:** "Invalid email or password"

**✅ Success indicators:**
- Member deleted successfully
- Cannot log in with deleted account
- Cannot delete your own account (button disabled)

---

### Test 9: Protected Routes

**Test these URLs while logged out:**
- http://localhost:5173/dashboard → Redirects to /login
- http://localhost:5173/admin → Redirects to /login

**Test these URLs while logged in as member (not admin):**
- http://localhost:5173/dashboard → Works ✅
- http://localhost:5173/admin → Redirects to /dashboard

**Test these URLs while logged in as admin:**
- http://localhost:5173/dashboard → Works ✅
- http://localhost:5173/admin → Works ✅

**✅ Success indicators:**
- Routes properly protected
- Non-admins cannot access admin panel
- Logged out users redirected to login

---

### Test 10: Session Persistence

1. **Log in** as any user
2. **Close browser tab**
3. **Open new tab:** http://localhost:5173
4. **Expected result:** Still logged in, dashboard loads automatically

**✅ Success indicators:**
- Session persists across browser tabs
- No need to log in again
- Cookie working correctly

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"

**Solution:**
- Make sure backend is running on port 3001
- Check terminal for errors
- Try restarting: `pnpm run server`

---

### Issue: "Database error"

**Solution:**
- Delete `server/data/members.db`
- Run `pnpm run seed` again
- Restart backend server

---

### Issue: "Login not working"

**Solution:**
- Check browser console (F12) for errors
- Verify credentials are correct
- Make sure both servers are running
- Clear browser cookies and try again

---

### Issue: "Port already in use"

**Solution:**
- Kill existing processes:
  ```bash
  # Mac/Linux
  lsof -ti:3001 | xargs kill
  lsof -ti:5173 | xargs kill
  
  # Windows
  netstat -ano | findstr :3001
  taskkill /PID <PID> /F
  ```

---

## 📊 API Endpoints (for testing)

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current member
- `GET /api/auth/status` - Check auth status

### Admin (requires admin privileges)
- `GET /api/admin/members` - List all members
- `POST /api/admin/members` - Create member
- `PATCH /api/admin/members/:id/status` - Toggle status
- `PATCH /api/admin/members/:id/password` - Reset password
- `DELETE /api/admin/members/:id` - Delete member

### Health Check
- `GET /api/health` - Server status

---

## 🔐 Security Notes

**Current Setup (Development):**
- Passwords hashed with bcrypt ✅
- Sessions stored in database ✅
- HTTP-only cookies ✅
- CORS enabled for localhost ✅

**For Production:**
- Change JWT_SECRET in .env
- Enable HTTPS only
- Use production database
- Add rate limiting
- Enable CSRF protection

---

## 📝 Test Results Template

Use this to document your testing:

```
Date: _______________
Tester: _______________

[ ] Test 1: Login as Member - PASS / FAIL
[ ] Test 2: Logout - PASS / FAIL
[ ] Test 3: Login as Admin - PASS / FAIL
[ ] Test 4: View Members - PASS / FAIL
[ ] Test 5: Add Member - PASS / FAIL
[ ] Test 6: Reset Password - PASS / FAIL
[ ] Test 7: Toggle Status - PASS / FAIL
[ ] Test 8: Delete Member - PASS / FAIL
[ ] Test 9: Protected Routes - PASS / FAIL
[ ] Test 10: Session Persistence - PASS / FAIL

Issues Found:
1. _______________
2. _______________
3. _______________

Overall Status: READY / NEEDS FIXES
```

---

## 🎯 Next Steps After Testing

Once all tests pass:

1. **Provide Feedback**
   - What works well?
   - What needs improvement?
   - Any features missing?

2. **Google Sheets Integration**
   - Connect real member data
   - Replace mock data
   - Set up automatic sync

3. **Deploy to Vercel**
   - Convert to serverless functions
   - Set up Vercel Postgres
   - Configure custom domain
   - Add environment variables

4. **GHL Portal Setup**
   - Create member portal in GHL
   - Upload resources
   - Add dashboard link button

---

## 📞 Support

**Questions or Issues?**
- Document any errors you see
- Take screenshots if helpful
- Note which test failed
- Share browser console errors

---

**Happy Testing! 🚀**

Once you've completed testing, let me know the results and we'll move forward with deployment!

