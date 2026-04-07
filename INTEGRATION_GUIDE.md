# 🔗 Backend-Frontend Integration Guide

## ✅ **Integration Status: COMPLETE**

All frontend pages are now properly wired to fetch real-time data from the backend API.

---

## 🚀 **Quick Start Guide**

### **Step 1: Start Backend Server**

```bash
# Navigate to backend folder
cd backend

# Install dependencies (if not done)
npm install

# Seed the database (creates admin user + sample data)
npm run seed

# Start development server
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000 in development mode
✅ MongoDB Connected
```

### **Step 2: Start Frontend Server**

```bash
# Open new terminal, navigate to frontend folder
cd bihar-tourism

# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
```

### **Step 3: Test Integration**

```bash
# In backend folder
node test_integration.js
```

**Expected Output:**
```
🧪 Testing Backend-Frontend Integration...

Testing: Health Check...
✅ PASSED - Health Check

Testing: Get All Destinations...
✅ PASSED - Get All Destinations
   → Count: 10

Testing: Get All Festivals...
✅ PASSED - Get All Festivals
   → Count: 5

...

📊 Test Results:
   ✅ Passed: 6
   ❌ Failed: 0
   📝 Total: 6

🎉 All tests passed! Frontend-Backend integration is working!
```

---

## 📡 **API Connections**

### **Public Endpoints (No Auth Required)**

| Frontend Page | API Endpoint | Data Displayed |
|--------------|--------------|----------------|
| Home (`/`) | `GET /api/destinations` | Featured destinations |
| Destinations (`/destinations`) | `GET /api/destinations` | All destinations list |
| Destination Detail (`/destinations/[id]`) | `GET /api/destinations/:id` | Single destination info |
| Festivals (`/festivals`) | `GET /api/festivals` | All festivals |
| Eco Tourism (`/eco-tourism`) | `GET /api/ecotourism` | Eco sites |
| Cultural (`/cultural`) | `GET /api/cultural` | Cultural sites |
| Smart Finder (`/smart-finder`) | `GET /api/recommendations` | Recommended destinations |

### **Protected Endpoints (Auth Required)**

| Frontend Page | API Endpoint | Data Displayed |
|--------------|--------------|----------------|
| Dashboard (`/dashboard`) | `GET /api/users/dashboard` | User favorites & trips |
| Trip Planner (`/trip-planner`) | `GET /api/itineraries` | User's itineraries |
| Destination Reviews | `GET /api/reviews/:id` | Reviews for destination |

### **Admin Endpoints (Admin Auth Required)**

| Frontend Page | API Endpoint | Data Displayed |
|--------------|--------------|----------------|
| Admin Dashboard (`/admin`) | `GET /api/admin/analytics` | Platform stats |
| Admin Users (`/admin/users`) | `GET /api/admin/users` | All users |
| Admin Destinations (`/admin/destinations`) | `GET /api/destinations` | All destinations |
| Admin Reviews (`/admin/reviews`) | `GET /api/admin/reviews` | All reviews |
| Admin Analytics (`/admin/analytics`) | `GET /api/admin/analytics` | Detailed analytics |

---

## 🔐 **Authentication Flow**

### **Login Process:**
1. User enters email/password on `/login`
2. Frontend sends: `POST /api/auth/login`
3. Backend returns: `{ token, user data }`
4. Frontend stores in `localStorage`
5. All subsequent requests include token in headers

### **Token Usage:**
```javascript
// Automatically added to all API requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

### **Admin Access:**
```javascript
// Admin user credentials (after seeding)
Email: admin@bihartourism.com
Password: admin123
```

---

## 📊 **Real-Time Data Features**

### **Auto-Refresh on Actions:**

#### **Admin Destinations Page:**
- ✅ Add destination → Auto-refreshes list
- ✅ Edit destination → Auto-refreshes list
- ✅ Delete destination → Auto-refreshes list

#### **Admin Users Page:**
- ✅ Change role → Updates instantly
- ✅ Delete user → Auto-refreshes list

#### **Admin Reviews Page:**
- ✅ Delete review → Auto-refreshes list

#### **Dashboard:**
- ✅ Fetches latest analytics on load

---

## 🔧 **API Configuration**

### **Backend URL:**
```typescript
// bihar-tourism/src/lib/api.ts
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### **CORS Enabled:**
```javascript
// backend/server.js
app.use(cors()); // Allows all origins in development
```

---

## 🧪 **Testing Each Page**

### **1. Test Public Pages:**

```bash
# Start both servers, then visit:

# Home page - should show destinations from database
http://localhost:3000

# Destinations - should show all 10+ destinations
http://localhost:3000/destinations

# Festivals - should show all festivals
http://localhost:3000/festivals

# Eco Tourism - should show eco sites
http://localhost:3000/eco-tourism
```

### **2. Test User Features:**

```bash
# 1. Register new user
http://localhost:3000/signup

# 2. Login
http://localhost:3000/login
Use: admin@bihartourism.com / admin123

# 3. View Dashboard (should show user data)
http://localhost:3000/dashboard

# 4. Create trip plan
http://localhost:3000/trip-planner
```

### **3. Test Admin Features:**

```bash
# Login as admin first, then:

# Admin Dashboard - should show analytics
http://localhost:3000/admin

# Users Management - should show user list
http://localhost:3000/admin/users

# Destinations CRUD - should allow add/edit/delete
http://localhost:3000/admin/destinations

# Reviews Moderation - should show all reviews
http://localhost:3000/admin/reviews

# Analytics - should show detailed stats
http://localhost:3000/admin/analytics
```

---

## 🔍 **Debugging Tips**

### **Check if Backend is Running:**
```bash
# Visit in browser
http://localhost:5000

# Should see:
{
  "success": true,
  "message": "🏛️ Bihar Tourism API is running",
  ...
}
```

### **Check Browser Console:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors or API responses

### **Check Network Tab:**
1. Open DevTools → Network tab
2. Refresh page
3. Check API calls:
   - Status codes (200 = success)
   - Response data
   - Request headers (should include Authorization)

### **Common Issues:**

#### **Issue 1: "Network Error"**
```
Solution:
1. Check if backend is running
2. Verify port 5000 is not blocked
3. Check CORS is enabled
```

#### **Issue 2: "401 Unauthorized"**
```
Solution:
1. Login again
2. Check if token is in localStorage
3. Verify token hasn't expired
```

#### **Issue 3: "403 Forbidden" (Admin pages)**
```
Solution:
1. Make sure you're logged in as admin
2. Check user role in database
3. Re-seed database to create admin user
```

#### **Issue 4: No data showing**
```
Solution:
1. Run: npm run seed (in backend)
2. Check MongoDB connection
3. Verify API endpoints in network tab
```

---

## 📈 **Data Flow Diagram**

```
User Action (Browser)
    ↓
React Component
    ↓
API Call (api.ts)
    ↓
Axios Request (with token)
    ↓
Backend Route (server.js)
    ↓
Controller
    ↓
MongoDB Query
    ↓
Response (JSON)
    ↓
Frontend State Update
    ↓
UI Re-renders with Data
```

---

## 🔄 **Real-Time Updates**

### **Current Implementation:**
- ✅ Data fetched on page load
- ✅ Auto-refresh after CRUD operations
- ✅ Optimistic UI updates

### **Example - Add Destination:**
```javascript
// 1. User clicks "Add Destination"
// 2. Fills form and submits
const handleSubmit = async (e) => {
  // 3. Send to backend
  await adminApi.addDestination(formData);
  
  // 4. Refresh list
  fetchDestinations();
  
  // 5. UI updates automatically
}
```

---

## 🛡️ **Error Handling**

### **Frontend Error Handling:**
```typescript
try {
  const res = await adminApi.getAllUsers();
  setUsers(res.data);
} catch (err) {
  console.error('Failed to fetch users:', err);
  // Shows error in console
  // Can add user-friendly toast notification
}
```

### **Backend Error Handling:**
```javascript
try {
  const users = await User.find();
  res.json({ success: true, data: users });
} catch (error) {
  next(error); // Goes to error middleware
}
```

### **Network Error Handling:**
```typescript
// Response interceptor (api.ts)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Auto-redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📝 **Environment Variables**

### **Backend (.env):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
JWT_SECRET=supersecretjwtkey123
```

### **Frontend:**
- Currently hardcoded to `http://localhost:5000`
- Can be moved to `.env.local` for different environments

---

## 🎯 **Performance Optimizations**

### **Implemented:**
- ✅ Axios instance (connection reuse)
- ✅ Token caching in localStorage
- ✅ Selective data fetching
- ✅ Loading states

### **Future Improvements:**
- [ ] React Query / SWR for caching
- [ ] Pagination for large datasets
- [ ] Debounced search
- [ ] Image lazy loading
- [ ] Data prefetching

---

## 📚 **API Documentation**

### **Test API Manually:**

```bash
# Get all destinations
curl http://localhost:5000/api/destinations

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bihartourism.com","password":"admin123"}'

# Get analytics (with token)
curl http://localhost:5000/api/admin/analytics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ✅ **Integration Checklist**

- [x] Backend server running on port 5000
- [x] Frontend server running on port 3000
- [x] CORS enabled
- [x] Database seeded with sample data
- [x] Admin user created
- [x] API base URL configured
- [x] Token authentication working
- [x] Error handling implemented
- [x] Loading states added
- [x] Real-time data fetching
- [x] Auto-refresh after mutations
- [x] Network error handling
- [x] Integration test script created

---

## 🎉 **You're All Set!**

Your frontend is now fully wired to the backend with:
- ✅ Real-time data fetching
- ✅ Authentication & authorization
- ✅ CRUD operations
- ✅ Error handling
- ✅ Loading states
- ✅ Auto-refresh
- ✅ Admin protections

**Start both servers and enjoy your fully functional Bihar Tourism Platform!** 🚀
