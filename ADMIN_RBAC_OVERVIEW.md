# 🔐 Admin RBAC System — Overview Design

## The Idea in One Diagram

```
Super Admin
    │
    ├── creates & manages ──► Admin Accounts
    │                               │
    │                               └── has granular ──► Permission Set
    │                                                         ├── manage_users
    │                                                         ├── manage_jobs
    │                                                         ├── manage_documents
    │                                                         ├── manage_subscriptions
    │                                                         ├── view_analytics
    │                                                         ├── manage_disputes
    │                                                         ├── send_notifications
    │                                                         ├── manage_payments
    │                                                         └── manage_worklogs
```

---

## 1. Dedicated Admin URLs

Instead of sharing `/auth/login` with regular users:

| Route | Purpose |
|---|---|
| `/admin-portal/login` | Admin-only login (email + password + 2FA) |
| `/admin-portal/register` | **Only accessible by Super Admin** — creates new admin accounts |
| `/admin/dashboard` | Existing admin panel (unchanged) |
| `/admin/management` | **New** — Super Admin manages all admin accounts |

> **Security:** The `/admin-portal/*` path is **never linked publicly**. Only Super Admin knows/shares the register URL, and it requires a Super Admin session to access.

---

## 2. Two-Tier Admin Hierarchy

### Super Admin
- **One** (or a few) top-level accounts
- Created **manually only** (by seeding the database — no UI registration)
- Has **all permissions** — cannot be restricted
- Can **create, edit, disable, delete** regular admins
- Can **assign/revoke** permissions per admin

### Regular Admin
- Created **only** by Super Admin via `/admin-portal/register`
- Has **only the permissions explicitly granted** by Super Admin
- Cannot create other admins
- Cannot change their own permissions

---

## 3. Permission System (Granular RBAC)

Each admin in the database has a `permissions` array. Every admin API route checks for the required permission.

### Available Permissions

| Permission Key | What it unlocks |
|---|---|
| `manage_users` | Approve/delete users, view user list |
| `manage_jobs` | Approve/close jobs, view job list |
| `manage_documents` | Approve/reject documents |
| `manage_subscriptions` | Edit/delete subscriptions |
| `manage_payments` | View invoices and payments |
| `manage_disputes` | View & resolve disputes |
| `view_analytics` | View dashboard analytics |
| `send_notifications` | Send push/system notifications |
| `manage_worklogs` | View & update work logs |

### Example Admin Profiles

| Admin Role | Permissions |
|---|---|
| Operations Admin | `manage_users`, `manage_jobs`, `manage_disputes` |
| Finance Admin | `manage_payments`, `manage_subscriptions`, `view_analytics` |
| Content Moderator | `manage_documents`, `manage_jobs` |
| Full Admin | All permissions |

---

## 4. Backend Changes Needed

### a) Updated Admin Schema (`models/User.js`)
```js
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  isSuperAdmin: { type: Boolean, default: false },
  permissions: [{
    type: String,
    enum: [
      'manage_users', 'manage_jobs', 'manage_documents',
      'manage_subscriptions', 'manage_payments', 'manage_disputes',
      'view_analytics', 'send_notifications', 'manage_worklogs'
    ]
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who created this admin
  isActive: { type: Boolean, default: true },
  department: String
});
```

### b) New Middleware: `hasPermission(permissionKey)` (`middleware/permissionMiddleware.js`)
```js
const hasPermission = (permission) => (req, res, next) => {
  if (req.user.isSuperAdmin) return next(); // Super Admin bypasses all checks
  if (req.user.permissions?.includes(permission)) return next();
  return res.status(403).json({ message: `Access denied: requires '${permission}'` });
};

// Usage in adminRoutes.js:
router.get('/users',     protect, admin, hasPermission('manage_users'),    getUsers);
router.get('/analytics', protect, admin, hasPermission('view_analytics'),  getAnalytics);
router.get('/documents', protect, admin, hasPermission('manage_documents'),getDocuments);
// ...and so on for every route
```

### c) New Super Admin Middleware (`middleware/superAdminMiddleware.js`)
```js
const superAdmin = (req, res, next) => {
  if (req.user && req.user.isSuperAdmin) return next();
  return res.status(403).json({ message: 'Super Admin access required' });
};
```

### d) New Admin Management Routes (`routes/adminPortalRoutes.js`)
```js
// All routes require: protect + superAdmin middleware
router.post('/register',                  protect, superAdmin, createAdmin);
router.get('/admins',                     protect, superAdmin, listAllAdmins);
router.put('/admins/:id/permissions',     protect, superAdmin, updateAdminPermissions);
router.put('/admins/:id/toggle-status',   protect, superAdmin, toggleAdminStatus);
router.delete('/admins/:id',              protect, superAdmin, deleteAdmin);
```

---

## 5. Frontend Changes Needed

### New Pages

| Page | Path | Access |
|---|---|---|
| Admin Login | `/admin-portal/login` | Public (but unlisted) |
| Admin Register | `/admin-portal/register` | Super Admin session only |
| Admin Management | `/admin/management` | Super Admin only |

### Admin Management UI (for Super Admin)
- **Table** of all admins: name, email, status, permissions, date created
- **Create Admin** button → form with permission checkboxes (name, email, password, select permissions)
- **Edit Permissions** per admin → permission toggle panel
- **Disable/Enable** admin toggle
- **Delete** admin with confirmation

### Permission-Aware Sidebar (`admin/layout.tsx`)
```tsx
const navItems = [
  { href: '/admin/dashboard',    icon: LayoutDashboard, labelKey: 'dashboard',    permission: null },          // always visible
  { href: '/admin/users',        icon: Users,           labelKey: 'users',         permission: 'manage_users' },
  { href: '/admin/jobs',         icon: ClipboardList,   labelKey: 'jobs',          permission: 'manage_jobs' },
  { href: '/admin/documents',    icon: FileText,        labelKey: 'documents',     permission: 'manage_documents' },
  { href: '/admin/disputes',     icon: Gavel,           labelKey: 'disputes',      permission: 'manage_disputes' },
  { href: '/admin/subscriptions',icon: CreditCard,      labelKey: 'subscriptions', permission: 'manage_subscriptions' },
  { href: '/admin/payments',     icon: Receipt,         labelKey: 'payments',      permission: 'manage_payments' },
  { href: '/admin/analytics',    icon: BarChart,        labelKey: 'analytics',     permission: 'view_analytics' },
  { href: '/admin/management',   icon: Shield,          labelKey: 'management',    permission: null, superAdminOnly: true }, // Super Admin only
].filter(item => {
  if (item.superAdminOnly) return user.isSuperAdmin;
  if (!item.permission) return true;
  return user.isSuperAdmin || user.permissions?.includes(item.permission);
});
```

---

## 6. Admin Login Flow (Dedicated)

```
User visits /admin-portal/login
        ↓
Enter Email + Password
        ↓
Backend checks: role === 'admin' AND isActive === true
        ↓
Send OTP to admin's registered mobile (2FA layer)
        ↓
User enters OTP → verified
        ↓
Backend issues JWT (short-lived: 15 minutes)
JWT payload includes: { id, role, isSuperAdmin, permissions[] }
        ↓
Frontend reads permissions from JWT response
        ↓
Redirect to /admin/dashboard
(Sidebar shows only permitted nav items)
```

---

## 7. Database: Super Admin Seed Script

Since Super Admin is created manually (not via UI), a seed script is needed:

```js
// scripts/seedSuperAdmin.js
const { Admin } = require('../models/User');

async function seedSuperAdmin() {
  const existing = await Admin.findOne({ isSuperAdmin: true });
  if (existing) return console.log('Super Admin already exists');

  await Admin.create({
    name: 'Super Admin',
    email: 'superadmin@shramikseva.com',
    password: 'StrongP@ssword123',
    mobile: '9999999999',
    isSuperAdmin: true,
    permissions: [], // Super Admin bypasses permission checks anyway
  });
  console.log('✅ Super Admin created');
}
seedSuperAdmin();
```

Run once: `node scripts/seedSuperAdmin.js`

---

## 8. Implementation Phases

| Phase | Tasks | Effort |
|---|---|---|
| **Phase 1** | Separate `/admin-portal/login` page, `isSuperAdmin` flag on schema, permission-aware sidebar | 2–3 days |
| **Phase 2** | `hasPermission` middleware on all admin routes, permission enforcement on backend | 1–2 days |
| **Phase 3** | `/admin/management` page — Super Admin creates/edits/disables admins | 2–3 days |
| **Phase 4** | 2FA on admin login, audit logs, account lockout | 2–3 days |

**Total estimated effort: ~1.5–2 weeks**

---

## 9. Security Summary

| Layer | Mechanism |
|---|---|
| URL obscurity | `/admin-portal/login` not linked publicly |
| Authentication | Email + Password + 2FA OTP |
| Authorization | JWT + `role === 'admin'` + `hasPermission()` middleware |
| Super Admin guard | `isSuperAdmin` flag bypasses permission checks |
| Account protection | `isActive` flag — Super Admin can instantly disable any admin |
| Audit trail | `createdBy` field tracks who created each admin |
