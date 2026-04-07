# 🚀 Quick Start - Bihar Tourism Platform

## ⚡ **Get Started in 3 Minutes!**

### **Step 1: Seed Database** (creates sample data + admin user)
```bash
cd backend
npm run seed
```

**Output:**
```
🗑️  Clearing existing data...
🌱 Seeding destinations...
🌱 Seeding festivals...
🌱 Seeding eco sites...
👤 Creating admin user...
✅ Admin user created: admin@bihartourism.com
✅ Database seeded successfully!
   → 10 destinations inserted
   → 5 festivals inserted
   → 3 eco sites inserted
   → 1 admin user created
```

### **Step 2: Start Backend**
```bash
npm run dev
```

**Output:**
```
🚀 Server running on port 5000 in development mode
✅ MongoDB Connected
```

### **Step 3: Start Frontend** (new terminal)
```bash
cd bihar-tourism
npm run dev
```

**Output:**
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
```

### **Step 4: Open in Browser**
```
http://localhost:3000
```

---

## 🔐 **Login Credentials**

### **Admin Access:**
- **Email:** `admin@bihartourism.com`
- **Password:** `admin123`

### **Admin Dashboard:**
```
http://localhost:3000/admin
```

---

## 🧪 **Test Integration**

```bash
# In backend folder
npm test
```

**Expected:**
```
🧪 Testing Backend-Frontend Integration...
✅ PASSED - Health Check
✅ PASSED - Get All Destinations
✅ PASSED - Get All Festivals
...
🎉 All tests passed!
```

---

## 📱 **Key URLs**

### **Public Pages:**
- Home: `http://localhost:3000`
- Destinations: `http://localhost:3000/destinations`
- Festivals: `http://localhost:3000/festivals`
- Eco Tourism: `http://localhost:3000/eco-tourism`
- Cultural: `http://localhost:3000/cultural`
- Smart Finder: `http://localhost:3000/smart-finder`
- Trip Planner: `http://localhost:3000/trip-planner`

### **User Pages (Login Required):**
- Dashboard: `http://localhost:3000/dashboard`
- Login: `http://localhost:3000/login`
- Signup: `http://localhost:3000/signup`

### **Admin Pages (Admin Login Required):**
- Admin Dashboard: `http://localhost:3000/admin`
- Manage Users: `http://localhost:3000/admin/users`
- Manage Destinations: `http://localhost:3000/admin/destinations`
- Moderate Reviews: `http://localhost:3000/admin/reviews`
- Analytics: `http://localhost:3000/admin/analytics`

---

## 🎯 **What You Can Do Now**

### **As Visitor:**
1. ✅ Browse destinations
2. ✅ View festivals
3. ✅ Use smart finder
4. ✅ View interactive map

### **As User (after signup):**
1. ✅ Login to dashboard
2. ✅ Save favorite destinations
3. ✅ Create trip plans
4. ✅ Write reviews

### **As Admin:**
1. ✅ View analytics dashboard
2. ✅ Add/edit/delete destinations
3. ✅ Manage users
4. ✅ Moderate reviews
5. ✅ View platform insights

---

## 🔧 **Troubleshooting**

### **Backend won't start:**
```bash
# Check if MongoDB is accessible
# Verify .env file exists with correct values
# Run: npm install
```

### **Frontend shows no data:**
```bash
# 1. Check backend is running
# 2. Run: npm run seed
# 3. Check browser console for errors
# 4. Verify network tab shows 200 responses
```

### **Can't login as admin:**
```bash
# Re-seed database
npm run seed
```

---

## 📊 **Sample Data Included**

### **Destinations (10):**
- Bodh Gaya
- Nalanda
- Rajgir
- Valmiki Tiger Reserve
- And 6 more...

### **Festivals (5):**
- Chhath Puja
- Sonepur Cattle Fair
- Madhushravani
- And 2 more...

### **Eco Sites (3):**
- Various wildlife sanctuaries

---

## 🎨 **Features Working**

- ✅ Real-time data from MongoDB
- ✅ User authentication (JWT)
- ✅ Admin role-based access
- ✅ CRUD operations
- ✅ Search & filter
- ✅ Interactive maps
- ✅ Reviews system
- ✅ Trip planner
- ✅ Smart recommendations
- ✅ Analytics dashboard

---

## 📞 **Need Help?**

1. Check `INTEGRATION_GUIDE.md` for detailed docs
2. Check `ADMIN_DASHBOARD_GUIDE.md` for admin features
3. Check `PHASE_1_PROGRESS.md` for project status
4. Run `npm test` to diagnose issues

---

**Enjoy exploring Bihar Tourism Platform!** 🎉
