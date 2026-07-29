# 🧪 MamaCare Testing Guide

Complete testing procedures for all features from local development through production.

---

## **PART 1: LOCAL DEVELOPMENT TESTING**

### Prerequisites
- Both `npm run dev` servers running (port 5000 for backend, 5174+ for frontend)
- MongoDB Atlas connected
- Clean browser (or fresh incognito window)
- DevTools open (F12)

---

### **Test 1: Registration Flow**
**Expected: New user can register and receive JWT token**

1. Visit frontend home page
2. Click "Create Account"
3. Fill form:
   - Name: "Test Mom"
   - Email: "testmom@example.com"
   - Password: "TestPass123"
4. Click Register
5. **Verify:**
   - ✓ No console errors
   - ✓ Redirected to dashboard
   - ✓ JWT token in localStorage: `localStorage.getItem('token')`
   - ✓ Network tab shows `POST /api/auth/register` returns `{ok: true, token: "..."}`

---

### **Test 2: Login Flow**
**Expected: Existing user can login and access dashboard**

1. Logout if logged in
2. Click "Login"
3. Fill form:
   - Email: "testmom@example.com"
   - Password: "TestPass123"
4. Click Login
5. **Verify:**
   - ✓ Redirected to dashboard
   - ✓ New JWT token generated
   - ✓ Network tab shows `POST /api/auth/login` returns token
   - ✓ No sensitive data in localStorage (password never stored)

---

### **Test 3: Add Baby**
**Expected: User can add multiple babies with validation**

1. On Dashboard, click "Add Baby"
2. Fill form with:
   - Name: "Layan"
   - DOB: "2024-06-15" (must be past date)
   - Gender: "Female"
   - Blood Type: "O+"
   - Birth Weight: "3.2"
   - Height: "50"
3. Click "Save Baby"
4. **Verify:**
   - ✓ Form validates (no future dates)
   - ✓ Redirected to Dashboard
   - ✓ Baby appears in list with auto-calculated age
   - ✓ Baby ID visible for copy-paste
   - ✓ Network: `POST /api/babies` returns created baby object

---

### **Test 4: Create Feeding Log**
**Expected: User can log feeding with time and amount**

1. Dashboard → Click "📝 Logs"
2. Fill form:
   - Baby ID: Copy from dashboard
   - Log Type: "🍼 Feeding"
   - Start Time: 2-3 hours ago
   - End Time: 1 hour ago
   - Amount: "120" ml
   - Notes: "Good feeding"
3. Click "Save Log"
4. **Verify:**
   - ✓ Success alert shown
   - ✓ Log appears in "Today's Logs" list
   - ✓ Shows type, time, amount, notes
   - ✓ Network: `POST /api/logs` returns created log
   - ✓ Log can be deleted (click ✕ button)

---

### **Test 5: Create Diaper Log**
**Expected: User can log diapers with notes**

1. Dashboard → Logs
2. Fill form:
   - Log Type: "💩 Diaper"
   - Start Time: Few minutes ago
   - Notes: "Normal poop"
3. Save Log
4. **Verify:**
   - ✓ Log type shows as DIAPER
   - ✓ Appears in list
   - ✓ Notes visible

---

### **Test 6: Create Sleep Log**
**Expected: User can track sleep duration**

1. Dashboard → Logs
2. Fill form:
   - Log Type: "😴 Sleep"
   - Start Time: 2 hours ago
   - End Time: 1 hour ago
3. Save Log
4. **Verify:**
   - ✓ Log type shows as SLEEP
   - ✓ Appears in list

---

### **Test 7: View Vaccines Schedule**
**Expected: User sees UAE MOH schedule and can mark vaccines done**

1. Dashboard → Click "💉 Vaccines"
2. Paste baby ID
3. **Verify:**
   - ✓ Schedule displays (23 vaccines)
   - ✓ Section shows "Upcoming" vaccines
   - ✓ Vaccines listed by age: Birth, 2mo, 4mo, etc.
   - ✓ Each vaccine shows name, age label, description

4. Click "✓ Mark Vaccine Done"
5. Fill form:
   - Vaccine Name: "BCG"
   - Date Done: Today
   - Photo URL: Leave empty
6. Click Save
7. **Verify:**
   - ✓ BCG moves to "✓ Completed" section
   - ✓ Network: `POST /api/vaccines/mark-done` succeeds

---

### **Test 8: Read Articles**
**Expected: User can browse, search, and bookmark articles**

1. Dashboard → Click "📚 Articles"
   (Note: No login required for articles)
2. **Verify:**
   - ✓ Articles list displayed (20+ articles)
3. Search: Type "sleep" in search box
   - ✓ Results filter to sleep-related articles
4. Filter by Category: Select "🍼 Feeding"
   - ✓ Shows only feeding articles
5. Click on article → Details view opens
6. Click "☆ Bookmark" button
   - ✓ Changes to "⭐ Bookmarked" (requires login)
7. View bookmarks: On bookmark page, see bookmarked articles

---

### **Test 9: Ask AI Questions**
**Expected: Mock AI responds with relevant advice**

1. Dashboard → Click "🤖 AI Help"
2. Paste baby ID
3. Ask question: "My baby has 38 fever what should I do"
4. Click "🔍 Get Answer"
5. **Verify:**
   - ✓ No error (check console)
   - ✓ Response contains: fever guidance, when to call doctor, disclaimer
   - ✓ Network: `POST /api/ai/ask` returns answer
   - ✓ Question appears in history
6. Show History → Click "📖 Show History"
   - ✓ Previous questions display
7. Ask another question: "how to help baby sleep"
   - ✓ Different response about sleep
   - ✓ History grows

---

### **Test 10: View Stats Dashboard**
**Expected: Real-time stats aggregated from logs**

1. Dashboard → Click "📊 Stats"
2. Paste baby ID
3. **Verify:**
   - ✓ Shows feeding count (should be 1+ from test 4)
   - ✓ Shows diaper count (1+ from test 5)
   - ✓ Shows sleep time in hours:minutes (from test 6)
   - ✓ Shows vaccines completed (1 from test 7)
   - ✓ Shows vaccines upcoming (22 remaining)
   - ✓ All displayed as colorful cards

---

### **Test 11: Navigation**
**Expected: Navbar works on all pages**

1. Navigate to any protected page (e.g., Dashboard)
2. **Verify navbar shows:**
   - ✓ MamaCare logo (clickable → Dashboard)
   - ✓ Dashboard link
   - ✓ Logs link
   - ✓ Vaccines link
   - ✓ Articles link
   - ✓ Logout button
3. On mobile (resize to <640px width):
   - ✓ Hamburger menu (☰) appears
   - ✓ Clicking opens mobile menu
   - ✓ All links still functional

---

### **Test 12: Logout**
**Expected: User logged out, redirected to login**

1. From any page, click "Logout" in navbar
2. **Verify:**
   - ✓ Redirected to home page
   - ✓ Token removed from localStorage: `localStorage.getItem('token')` → null
   - ✓ Clicking dashboard link requires login
   - ✓ Login page loads

---

### **Test 13: Protected Routes**
**Expected: Unauthenticated users cannot access protected pages**

1. Logout
2. Try to visit: `localhost:5174/dashboard`
3. **Verify:**
   - ✓ Redirected to login page
4. Try: `localhost:5174/logs`
   - ✓ Redirected to login
5. Try: `localhost:5174/ai-assistant`
   - ✓ Redirected to login
6. Try: `localhost:5174/articles` (public)
   - ✓ Displays without login

---

### **Test 14: Error Handling**
**Expected: App gracefully handles errors**

1. **Network Error**: Stop backend server
   - Go to Logs page with baby ID
   - Try to create log
   - **Verify:** Error message shown (not blank page crash)
   - **Verify:** Console shows error, no red error overlay crashes app

2. **Invalid Token**: Manually edit localStorage
   - Set: `localStorage.setItem('token', 'invalid_token')`
   - Go to Dashboard
   - **Verify:** API returns 401 error, redirects to login

3. **Missing Required Fields**: Create log without baby ID
   - **Verify:** Form validation prevents submit (or shows error)

---

### **Test 15: Responsive Design**
**Expected: App works on mobile, tablet, desktop**

1. **Desktop (1920px):**
   - Right-click → Inspect → Toggle device toolbar
   - Set to "Responsive"
   - Drag to 1920px width
   - **Verify:** Full navbar visible, all content readable

2. **Tablet (768px):**
   - Set to 768px width
   - **Verify:** Content still readable, buttons accessible
   - Grid layouts adapt (2 columns where applicable)

3. **Mobile (375px):**
   - Set to 375px (iPhone SE)
   - **Verify:** Hamburger menu appears
   - **Verify:** Buttons large enough to tap
   - **Verify:** Forms scroll properly
   - **Verify:** No horizontal scrolling

---

## **PART 2: BACKEND TESTING**

### Test API Directly with curl

```bash
# Test health endpoint
curl -X GET http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test123"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123"}' | jq -r '.token')

echo $TOKEN  # Should print JWT token

# Create baby with token
curl -X POST http://localhost:5000/api/babies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name":"Test Baby",
    "dob":"2024-06-15",
    "gender":"Male",
    "bloodType":"O+",
    "birthWeightKg":3.2,
    "heightCm":50
  }'

# Get all babies
curl -X GET http://localhost:5000/api/babies \
  -H "Authorization: Bearer $TOKEN"

# Create log
curl -X POST http://localhost:5000/api/logs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "babyId":"<baby_id>",
    "type":"feeding",
    "startTime":"2026-07-24T10:00:00Z",
    "endTime":"2026-07-24T10:30:00Z",
    "amount":120,
    "notes":"Good feeding"
  }'
```

---

## **PART 3: DATABASE TESTING**

### Verify MongoDB Connection

```bash
# SSH into MongoDB Atlas or use MongoDB Compass

# Check users collection
db.users.find().pretty()

# Check babies
db.babies.find().pretty()

# Check logs
db.logs.find().pretty()

# Check vaccines
db.vaccinedones.find().pretty()

# Check articles
db.articles.count()  # Should be 20+
```

---

## **PART 4: PERFORMANCE TESTING**

### Load Testing
1. Open DevTools → Network tab
2. Create multiple logs rapidly
3. **Verify:**
   - ✓ Response times < 500ms
   - ✓ No request timeouts
   - ✓ UI stays responsive

### Bundle Size
```bash
cd client
npm run build
# Check dist/ folder size (should be <500KB total)
```

---

## **PART 5: PRODUCTION TESTING**

After deploying to Render + Vercel:

1. **Test Frontend URL**
   - Visit: https://mamacare-xxxx.vercel.app
   - Register → Add Baby → Create Log → Works?

2. **Test Backend URL**
   - Visit: https://mamacare-api-xxxx.onrender.com/health
   - Returns: `{status: "OK", ...}`?

3. **Test API from Production Frontend**
   - Console Network tab shows API calls to production backend?
   - All endpoints respond with correct data?

4. **Test End-to-End Production Flow**
   - Register
   - Add baby
   - Create logs
   - View vaccines
   - Bookmark articles
   - Ask AI
   - View stats
   - **All working in production?**

---

## **PART 6: BROWSER COMPATIBILITY**

Test on:
- ✓ Chrome 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ Edge 90+
- ✓ Mobile Chrome
- ✓ Mobile Safari

---

## **Checklist: Before Release**

- [ ] All local tests pass
- [ ] No console errors/warnings
- [ ] Backend API tests pass
- [ ] Database populated correctly
- [ ] Responsive design verified
- [ ] Error handling works
- [ ] Performance acceptable
- [ ] Production deployment successful
- [ ] Production end-to-end flow works
- [ ] Browser compatibility verified

---

**Ready to test! 🧪**
