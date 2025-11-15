# The $100K CPA Club - Performance Dashboard

**Version:** MVP 1.0 with Authentication  
**Status:** Ready for Testing  
**Last Updated:** November 15, 2025

---

## 🎯 Project Overview

A professional performance dashboard for CPA Club members to track their client referrals, approved deals, commissions, and progress toward the $100K annual target.

**Live Dashboard:** https://dashboard.fundinginsidersshow.com  
**GitHub Repository:** https://github.com/chrisollinwhite/cpa-club-dashboard

---

## ✨ Features

### Current (MVP 1.0)
- ✅ **Member Authentication** - Secure email/password login
- ✅ **Performance Dashboard** - Track clients, deals, earnings
- ✅ **Admin Panel** - Manage members, reset passwords
- ✅ **Progress Tracking** - Visual progress to $100K target
- ✅ **Interactive Charts** - Monthly trends, deal distribution
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Session Management** - Persistent login sessions

### Coming Soon (Phase 2)
- ⏳ **Google Sheets Integration** - Live data sync
- ⏳ **GHL Portal Integration** - Single sign-on
- ⏳ **Email Notifications** - Performance updates
- ⏳ **Password Reset** - Self-service password recovery
- ⏳ **Activity Logging** - Track member actions
- ⏳ **Advanced Analytics** - Deeper insights

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **Vite 6.3.5** - Build tool
- **React Router 7.6.1** - Routing
- **Recharts 2.15.3** - Data visualization
- **Tailwind CSS 4.1.7** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express 5.1.0** - API server
- **SQLite (better-sqlite3)** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Session tokens
- **cookie-parser** - Cookie handling

### Deployment
- **Vercel** - Hosting platform
- **GitHub** - Version control

---

## 📁 Project Structure

```
cpa-dashboard/
├── src/                      # Frontend source
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   └── ProtectedRoute.jsx
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication state
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx    # Login form
│   │   ├── DashboardPage.jsx # Main dashboard
│   │   └── AdminPage.jsx    # Admin panel
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── server/                   # Backend source
│   ├── models/              # Database models
│   │   └── database.js      # SQLite setup
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication
│   │   └── admin.js         # Admin operations
│   ├── middleware/          # Express middleware
│   │   └── auth.js          # Auth middleware
│   ├── utils/               # Utilities
│   │   └── auth.js          # Auth helpers
│   ├── data/                # Database files
│   │   └── members.db       # SQLite database
│   ├── index.js             # Server entry
│   └── seed.js              # Database seeding
├── public/                   # Static assets
├── .env                      # Environment variables
├── package.json              # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── TESTING_GUIDE.md         # Testing instructions
└── README.md                # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- pnpm (or npm)

### Installation

```bash
# Clone repository
git clone https://github.com/chrisollinwhite/cpa-club-dashboard.git
cd cpa-club-dashboard

# Install dependencies
pnpm install

# Initialize database
pnpm run seed

# Start backend (Terminal 1)
pnpm run server

# Start frontend (Terminal 2)
pnpm run dev
```

### Access
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

### Test Accounts
- **Admin:** admin@fundinginsidersshow.com / CPA100K2025!
- **Member:** chris@fundinginsidersshow.com / TestPass123!

---

## 📚 Documentation

- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Complete testing instructions
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Vercel deployment guide (coming soon)
- **[API_DOCS.md](./API_DOCS.md)** - API endpoint documentation (coming soon)

---

## 🎨 Brand Colors

- **Primary (Navy Blue):** `#1B2B4D`
- **Accent (Neon Yellow-Green):** `#B8FF3C`
- **Background:** `#FFFFFF`
- **Muted:** `#6B7280`

---

## 🔐 Security

### Current Implementation
- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ HTTP-only cookies
- ✅ Session-based authentication
- ✅ JWT tokens (7-day expiry)
- ✅ Protected API routes
- ✅ Input validation
- ✅ SQL injection prevention (parameterized queries)

### Production Recommendations
- Change JWT_SECRET in environment variables
- Enable HTTPS only
- Add rate limiting
- Implement CSRF protection
- Use production database
- Enable security headers
- Add audit logging

---

## 📊 Database Schema

### Members Table
```sql
CREATE TABLE members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  is_admin INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id)
);
```

---

## 🔧 Available Scripts

```bash
# Development
pnpm run dev          # Start frontend dev server
pnpm run server       # Start backend API server
pnpm run seed         # Initialize database with test data

# Production
pnpm run build        # Build frontend for production
pnpm run preview      # Preview production build

# Utilities
pnpm run lint         # Run ESLint
```

---

## 🌐 Environment Variables

### Development (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:3001

# JWT Secret
JWT_SECRET=your-secret-key-here

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Production (Vercel)
```env
VITE_API_URL=https://dashboard.fundinginsidersshow.com
JWT_SECRET=<strong-random-secret>
DATABASE_URL=<vercel-postgres-url>
NODE_ENV=production
```

---

## 🚢 Deployment

### Current Deployment
- **Platform:** Vercel
- **Domain:** dashboard.fundinginsidersshow.com
- **Status:** Static version (no auth yet)

### Next Deployment (with Auth)
1. Convert Express to Vercel serverless functions
2. Migrate SQLite to Vercel Postgres
3. Update environment variables
4. Deploy via GitHub integration
5. Test authentication in production

---

## 📈 Roadmap

### Phase 1: MVP ✅ (Complete)
- [x] Dashboard UI
- [x] Authentication system
- [x] Admin panel
- [x] Local testing

### Phase 2: Integration (In Progress)
- [ ] Google Sheets integration
- [ ] Live data sync
- [ ] GHL portal setup
- [ ] Deploy to production

### Phase 3: Enhancement (Planned)
- [ ] Password reset flow
- [ ] Email notifications
- [ ] Activity logging
- [ ] Advanced analytics
- [ ] Mobile app

### Phase 4: Scale (Future)
- [ ] Multi-level access
- [ ] Team management
- [ ] Custom reports
- [ ] API for integrations

---

## 🤝 Contributing

This is a private project for The $100K CPA Club. For questions or support:

**Contact:** support@fundinginsidersshow.com

---

## 📄 License

© 2025 Funding Insiders Show. All rights reserved.

---

## 🙏 Acknowledgments

- **Design:** Custom brand colors and UI
- **Icons:** Lucide React
- **Components:** shadcn/ui
- **Charts:** Recharts
- **Hosting:** Vercel

---

**Built with ❤️ for The $100K CPA Club**

