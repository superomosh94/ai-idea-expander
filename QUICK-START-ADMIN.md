# 🚀 Quick Start Guide - Admin & Password Reset

## ⚡ Setup (2 Steps)

### Step 1: Run Database Migration
```bash
mysql -u root -p ai_idea_expander < scripts/password-reset-table.sql
```

### Step 2: Create Your First password-reset-table Admin
```sql
mysql -u root -p ai_idea_expander
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
exit
```

---

## 🔑 Password Reset

### User Flow:
1. Login page → "Forgot Password?"
2. Enter email address
3. Check **server console** for reset URL (development mode)
4. Open URL → Enter new password
5. Login with new credentials

### For Production (Email Setup):
```bash
npm install nodemailer
```

Add to `.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 👨‍💼 Admin Dashboard

### Access:
1. Login with admin account
2. Click your name (top right)
3. Click "Admin Dashboard"

### Features:
- **Dashboard:** Statistics + Recent activity
- **Users:** View, activate/deactivate, delete
- **Ideas:** View, delete
- **Statistics:** System-wide metrics

### URLs:
- Dashboard: `http://localhost:3000/admin/dashboard`
- User Management: `http://localhost:3000/admin/users`
- Idea Management: `http://localhost:3000/admin/ideas`
- Statistics: `http://localhost:3000/admin/statistics`

---

## 🎯 Testing Checklist

Password Reset:
- [ ] Visit `/auth/login` → Click "Forgot Password?"
- [ ] Submit email → Check console logs
- [ ] Use reset URL → Set new password
- [ ] Login successfully

Admin Panel:
- [ ] Login as admin → See "Admin Dashboard" in dropdown
- [ ] Click dashboard → View statistics
- [ ] Manage users → Toggle status
- [ ] View ideas → Check listing

Favicon:
- [ ] Check browser tab for lightbulb icon
- [ ] Verify on all pages

---

## 📞 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| No password reset table | Run migration: `scripts/password-reset-table.sql` |
| No admin link showing | Update user role to 'admin' in database |
| Reset URL not in console | Check server is running and user email exists |
| Can't access admin panel| Verify `user.role = 'admin'` and session is active |
| Favicon not showing | Hard refresh browser (Ctrl+F5) |

---

## 📂 New Files Reference

**Views:**
- `views/auth/forgot-password.ejs`
- `views/auth/reset-password.ejs`
- `views/admin/dashboard.ejs`

**Controllers:**
- `controllers/passwordResetController.js`
- `controllers/adminController.js`

**Routes:**
- `routes/adminRoutes.js`

**Database:**
- `scripts/password-reset-table.sql`

**Assets:**
- `public/favicon.png`

---

## 🔒 Security Notes

✅ All admin routes protected by role-based middleware  
✅ Password reset tokens expire in 60 minutes  
✅ Tokens are single-use only  
✅ CSRF protection enabled  
✅ No self-deletion for admin users  

---

## 📖 Full Documentation

See **`ADMIN-PASSWORD-RESET-GUIDE.md`** for complete details.

---

**Status:** ✅ Ready to Use  
**Last Updated:** 2025-12-07
