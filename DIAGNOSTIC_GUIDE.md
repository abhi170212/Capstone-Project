# 🔍 Complete Diagnostic Guide - Admin Auth Issue

## ⚡ **Follow These Steps EXACTLY**

### **Step 1: Fix Database (Run This First)**

```bash
cd backend
node fix_admin_role.js
```

**Expected Output:**
```
🔧 Fixing admin user role...

Current admin user data:
  Name: Admin User
  Email: admin@bihartourism.com
  Role: NOT SET

✅ Admin role updated successfully!

Verified admin user data:
  Name: Admin User
  Email: admin@bihartourism.com
  Role: admin

🎉 Fix complete!
```

**If it says "Role: admin" already**, then run:
```bash
npm run seed
```

---

### **Step 2: Clear Browser Data COMPLETELY**

1. **Open your app in browser** (http://localhost:3000)

2. **Open DevTools** (Press F12)

3. **Go to Application tab** (or Storage in Firefox)

4. **Clear everything:**
   - Click "Clear site data" button
   - OR manually delete:
     - Local Storage → http://localhost:3000 → Clear all
     - Session Storage → http://localhost:3000 → Clear all
     - Cookies → Clear all

5. **Or run in console:**
   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   // Then reload page
   location.reload()
   ```

---

### **Step 3: Restart Backend Server**

```bash
# Stop the current backend (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

Wait for:
```
🚀 Server running on port 5000 in development mode
✅ MongoDB Connected
```

---

### **Step 4: Login Fresh**

1. **Go to:** http://localhost:3000/login

2. **Login with:**
   - Email: `admin@bihartourism.com`
   - Password: `admin123`

3. **After login, open console (F12) and run:**
   ```javascript
   const user = JSON.parse(localStorage.getItem('userInfo'));
   console.log('User data:', user);
   console.log('Has role?', 'role' in user);
   console.log('Role value:', user.role);
   ```

   **MUST see:**
   ```javascript
   User data: {
     _id: "...",
     name: "Admin User",
     email: "admin@bihartourism.com",
     role: "admin",     // ✅ THIS MUST BE HERE
     token: "...",
     ...
   }
   Has role? true
   Role value: admin
   ```

   **If role is missing or undefined**, DO NOT proceed. Go back to Step 1.

---

### **Step 5: Test Admin Access**

1. **Go to:** http://localhost:3000/admin/destinations

2. **Open DevTools → Network tab**

3. **Click "Add Destination"**

4. **Fill the form:**
   - Name: Test Destination
   - Description: Test
   - Location: Test Location
   - Type: cultural
   - (Other fields can be default)

5. **Click "Create Destination"**

6. **Watch Network tab:**
   - Look for POST request to `/admin/add-destination`
   - Check Request Headers:
     ```
     Authorization: Bearer eyJhbGci...
     ```
   - Check Response:
     - ✅ Status 200 = Success
     - ❌ Status 403 = Still not authorized

---

### **Step 6: Check Backend Console**

If you still get 403 error, **check the backend terminal**. You should see detailed logs:

```
❌ Admin check failed for user: {
  userId: "67f123...",
  userEmail: "admin@bihartourism.com",
  userRole: undefined,    // ← THIS IS THE PROBLEM
  hasUser: true
}
```

**If `userRole` is `undefined` or `"user"` instead of `"admin"`**, the database still doesn't have the role set correctly.

---

## 🔧 **Nuclear Option (If Nothing Else Works)**

### **Complete Reset:**

```bash
# 1. Stop both servers

# 2. Fix database
cd backend
npm run seed

# 3. Clear browser completely
# - Clear all site data for localhost:3000
# - Clear all site data for localhost:5000
# - Close browser completely
# - Reopen browser

# 4. Restart backend
cd backend
npm run dev

# 5. In new terminal, restart frontend
cd bihar-tourism
npm run dev

# 6. Login fresh
# - Go to http://localhost:3000/login
# - Login with admin credentials
# - Verify role in console
# - Try adding destination
```

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: "Admin user not found"**
```
Solution: Run npm run seed
```

### **Issue 2: Role is still undefined after fix**
```
Solution: 
1. Check MongoDB directly:
   db.users.findOne({ email: "admin@bihartourism.com" })
   
2. If role is missing, update manually:
   db.users.updateOne(
     { email: "admin@bihartourism.com" },
     { $set: { role: "admin" } }
   )
```

### **Issue 3: Token is old/invalid**
```
Solution:
1. Logout
2. Clear localStorage
3. Login again
4. New token will be generated with role info
```

### **Issue 4: CORS error**
```
Solution:
Check backend has: app.use(cors())
Restart backend server
```

### **Issue 5: Frontend caching old data**
```
Solution:
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Use incognito/private window to test
```

---

## ✅ **Verification Checklist**

Before testing, verify ALL of these:

- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000
- [ ] Database is seeded (`npm run seed` completed successfully)
- [ ] Admin user exists in database with `role: "admin"`
- [ ] Browser localStorage is cleared
- [ ] Logged in with admin credentials
- [ ] localStorage shows user object WITH `role: "admin"`
- [ ] Network tab shows Authorization header in requests
- [ ] Backend console shows no errors

---

## 🎯 **Quick Test Commands**

### **Check Database:**
```bash
# In backend folder
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const User = require('./models/User');
  const admin = await User.findOne({ email: 'admin@bihartourism.com' });
  console.log('Admin user:', {
    name: admin?.name,
    email: admin?.email,
    role: admin?.role
  });
  process.exit(0);
});
"
```

### **Check API:**
```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bihartourism.com","password":"admin123"}'

# Should return user data WITH role: "admin"
```

---

## 📞 **If Still Not Working**

Send me the output of these commands:

1. **Backend console logs** (when you try to add destination)
2. **Browser console logs** (any errors)
3. **Network tab** (request & response for the failed request)
4. **localStorage content:**
   ```javascript
   console.log(localStorage.getItem('userInfo'))
   ```
5. **Database check:**
   ```bash
   cd backend
   node fix_admin_role.js
   ```

---

**Start with Step 1 (run fix_admin_role.js) and follow each step carefully!** 🚀
