# MamaCare - Baby Tracker & Mom Support App

A mobile-first web app designed for new moms in UAE to track their baby's daily activities, manage vaccinations, and get trusted AI-powered advice.

## 🎯 Overview

**Target Users:** Moms (0-24 months postpartum) in UAE, ages 22-40. Also: Dads, nannies, grandparents helping with baby.

**Focus:** 0-2 years after birth. One place for logs, vaccines, AI answers, and articles.

## 🛠 Tech Stack

- **Frontend:** React + Vite + Tailwind CSS (mobile-first)
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose (MongoDB Atlas)
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Vercel (client) + Render (server)

## ✨ Core Features (V1)

### A. Authentication
- Register/Login with email + password
- JWT protected routes
- Forgot password via email

### B. Baby Profile
- Add multiple babies per user
- Fields: Name, DOB, Gender, Blood Type, Birth Weight, Photo
- Auto-calculate baby age (e.g., "3 months 2 weeks")
- Switch between babies on dashboard

### C. Daily Baby Logs
- **Feeding:** Track breast, bottle, or solid. Duration + amount (ml)
- **Diaper:** Log pee, poo, or mixed. Add notes
- **Sleep:** Start/stop timer for naps and night sleep
- **History:** View logs by day/week. See daily stats (e.g., "8 feedings today, 12 hours sleep")

### D. Vaccination Tracker
- Pre-loaded UAE MOH vaccine schedule by age
- Auto-show "Upcoming" and "Due" vaccines based on baby DOB
- Mark vaccines as completed + upload vaccine card photo
- Simple reminders (e.g., "MMR due next week")

### E. AI Mom Assistant
- Chat interface: Ask questions like "My baby has 38°C fever, what to do?"
- AI returns safe, general advice + pediatrician disclaimer
- Save question history
- Powered by mock AI (for V1) or Gemini/OpenAI

### F. Articles & Tips
- 20+ pre-written articles
- Categories: Feeding, Sleep, Health, Development
- Search and bookmark articles

### G. Design
- Soft, calm, clean UI
- Colors: Pink, Lavender, White
- 100% mobile-first
- Tailwind CSS only

## 📋 Database Structure

```
User: _id, name, email, password, createdAt
Baby: _id, userId, name, dob, gender, photoUrl, bloodType, birthWeight, createdAt
Log: _id, babyId, type (feeding/diaper/sleep), startTime, endTime, amount, notes, createdAt
VaccineDone: _id, babyId, vaccineName, dateDone, photoUrl, createdAt
Article: _id, title, category, content, createdAt
Question: _id, userId, babyId, question, response, createdAt
```

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v16+) installed
- MongoDB Atlas account + connection string
- Git

### Setup

1. **Clone the repo** (if shared)
   ```bash
   git clone <your-repo-url>
   cd mamacare
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env and add your MongoDB Atlas URI and JWT secret
   npm start
   ```
   Server runs on `http://localhost:5000`

3. **Setup Client**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
   Client runs on `http://localhost:5173`

4. **Test**
   - Visit `http://localhost:5173` in your browser
   - Should see "MamaCare — coming soon"

## 📁 Project Structure

```
mamacare/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Home.jsx
│   │   ├── pages/
│   │   ├── components/
│   │   └── ...
│   ├── package.json
│   ├── tailwind.config.js
│   └── ...
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Baby.js
│   │   ├── Log.js
│   │   ├── VaccineDone.js
│   │   └── Article.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── babies.js
│   │   ├── logs.js
│   │   └── ...
│   ├── middleware/
│   │   └── auth.js
│   ├── data/
│   │   └── vaccines.json
│   ├── index.js
│   ├── package.json
│   └── .env.example
├── README.md
├── LICENSE
└── .gitignore
```

## 📝 Success Metrics

A mom can complete this flow in < 5 minutes:
1. Register
2. Add a baby
3. Log one feeding
4. See it on dashboard
5. Check next vaccine
6. Ask AI one question

## 🔄 Roadmap (Future)

- Real AI integration (OpenAI or Gemini API)
- Push notifications & reminders
- Photo uploads & storage
- Analytics dashboard
- Multi-language support
- Wearable device integration

## 🔌 API Endpoints Reference

### **Base URL**
- **Local:** `http://localhost:5000`
- **Production:** `https://mamacare-api.render.com` (after deployment)

All authenticated endpoints require header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

### **1️⃣ AUTHENTICATION**

#### Register
```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "name": "Fatima",
  "email": "fatima@example.com",
  "password": "SecurePass123"
}

Response (201):
{
  "ok": true,
  "user": {
    "id": "64e8f6b2c2a7f3d1e5b4a9c8",
    "name": "Fatima",
    "email": "fatima@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "fatima@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "ok": true,
  "user": {
    "id": "64e8f6b2c2a7f3d1e5b4a9c8",
    "name": "Fatima",
    "email": "fatima@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
```
GET /api/auth/me
Auth: Required ✅

Response (200):
{
  "ok": true,
  "user": {
    "_id": "64e8f6b2c2a7f3d1e5b4a9c8",
    "name": "Fatima",
    "email": "fatima@example.com",
    "createdAt": "2026-07-24T12:41:21.694Z"
  }
}
```

---

### **2️⃣ BABIES (CRUD)**

#### Create Baby
```
POST /api/babies
Auth: Required ✅
Content-Type: application/json

Request Body:
{
  "name": "Layla",
  "dob": "2026-03-15",
  "gender": "female",
  "bloodType": "B+",
  "birthWeightKg": 3.5,
  "heightCm": 50
}

Response (200):
{
  "ok": true,
  "baby": {
    "_id": "64e8f6b2c2a7f3d1e5b4a9d9",
    "userId": "64e8f6b2c2a7f3d1e5b4a9c8",
    "name": "Layla",
    "dob": "2026-03-15T00:00:00.000Z",
    "gender": "female",
    "bloodType": "B+",
    "birthWeightKg": 3.5,
    "heightCm": 50,
    "ageReadable": "4 months 1 week",
    "createdAt": "2026-07-24T12:41:21.694Z"
  }
}
```

#### List User's Babies
```
GET /api/babies
Auth: Required ✅

Response (200):
{
  "ok": true,
  "babies": [
    {
      "_id": "64e8f6b2c2a7f3d1e5b4a9d9",
      "name": "Layla",
      "dob": "2026-03-15T00:00:00.000Z",
      "ageReadable": "4 months 1 week",
      "gender": "female"
    }
  ]
}
```

#### Get Baby by ID
```
GET /api/babies/:babyId
Auth: Required ✅

Response (200):
{
  "ok": true,
  "baby": { /* baby object */ }
}
```

#### Update Baby
```
PUT /api/babies/:babyId
Auth: Required ✅
Content-Type: application/json

Request Body:
{
  "name": "Layla Rose",
  "heightCm": 52
}

Response (200):
{
  "ok": true,
  "baby": { /* updated baby object */ }
}
```

#### Delete Baby
```
DELETE /api/babies/:babyId
Auth: Required ✅

Response (200):
{
  "ok": true
}
```

---

### **3️⃣ LOGS (Feeding, Diaper, Sleep)**

#### Create Log
```
POST /api/logs
Auth: Required ✅
Content-Type: application/json

Request Body (Feeding):
{
  "babyId": "64e8f6b2c2a7f3d1e5b4a9d9",
  "type": "feeding",
  "startTime": "2026-07-24T09:00:00Z",
  "endTime": "2026-07-24T09:15:00Z",
  "amount": 120,
  "notes": "Left breast only"
}

Request Body (Sleep):
{
  "babyId": "64e8f6b2c2a7f3d1e5b4a9d9",
  "type": "sleep",
  "startTime": "2026-07-24T13:00:00Z",
  "endTime": "2026-07-24T14:30:00Z",
  "notes": "Afternoon nap"
}

Request Body (Diaper):
{
  "babyId": "64e8f6b2c2a7f3d1e5b4a9d9",
  "type": "diaper",
  "startTime": "2026-07-24T10:00:00Z",
  "notes": "Poo, yellow color"
}

Response (200):
{
  "ok": true,
  "log": {
    "_id": "64e8f6b2c2a7f3d1e5b4a9ea",
    "babyId": "64e8f6b2c2a7f3d1e5b4a9d9",
    "type": "feeding",
    "startTime": "2026-07-24T09:00:00.000Z",
    "endTime": "2026-07-24T09:15:00.000Z",
    "amount": 120,
    "notes": "Left breast only",
    "createdAt": "2026-07-24T12:41:21.694Z"
  }
}
```

#### List Logs for Baby by Date
```
GET /api/logs?babyId=64e8f6b2c2a7f3d1e5b4a9d9&date=2026-07-24
Auth: Required ✅

Response (200):
{
  "ok": true,
  "logs": [
    { /* log object 1 */ },
    { /* log object 2 */ }
  ]
}
```

#### Update Log (Stop Timer)
```
PUT /api/logs/:logId
Auth: Required ✅
Content-Type: application/json

Request Body:
{
  "endTime": "2026-07-24T14:30:00Z"
}

Response (200):
{
  "ok": true,
  "log": { /* updated log */ }
}
```

#### Delete Log
```
DELETE /api/logs/:logId
Auth: Required ✅

Response (200):
{
  "ok": true
}
```

#### Get Daily Stats
```
GET /api/logs/stats?babyId=64e8f6b2c2a7f3d1e5b4a9d9&date=2026-07-24
Auth: Required ✅

Response (200):
{
  "ok": true,
  "stats": {
    "feedingCount": 8,
    "feedingTotalMl": 960,
    "diaperCount": 6,
    "sleepCount": 3,
    "sleepTotalMinutes": 720
  }
}
```

---

### **4️⃣ VACCINES**

#### Get Vaccine Schedule for Baby
```
GET /api/vaccines?babyId=64e8f6b2c2a7f3d1e5b4a9d9
Auth: Required ✅

Response (200):
{
  "ok": true,
  "vaccines": {
    "upcoming": [
      {
        "name": "MMR",
        "ageMonths": 12,
        "daysUntilDue": 45
      }
    ],
    "due": [
      {
        "name": "Pentavalent (1st dose)",
        "ageMonths": 2,
        "daysSinceDue": 5
      }
    ],
    "completed": [
      {
        "name": "BCG",
        "dateDone": "2026-03-15T00:00:00.000Z",
        "photoUrl": "https://example.com/vaccine-card.jpg"
      }
    ]
  }
}
```

#### Mark Vaccine as Done
```
POST /api/vaccines/mark-done
Auth: Required ✅
Content-Type: application/json

Request Body:
{
  "babyId": "64e8f6b2c2a7f3d1e5b4a9d9",
  "vaccineName": "Pentavalent (1st dose)",
  "dateDone": "2026-07-24T10:00:00Z",
  "photoUrl": "https://example.com/vaccine-photo.jpg"
}

Response (200):
{
  "ok": true,
  "done": {
    "_id": "64e8f6b2c2a7f3d1e5b4a9eb",
    "babyId": "64e8f6b2c2a7f3d1e5b4a9d9",
    "vaccineName": "Pentavalent (1st dose)",
    "dateDone": "2026-07-24T10:00:00.000Z",
    "photoUrl": "https://example.com/vaccine-photo.jpg",
    "createdAt": "2026-07-24T12:41:21.694Z"
  }
}
```

---

### **5️⃣ ARTICLES**

#### List All Articles
```
GET /api/articles
Auth: Not required

Response (200):
{
  "ok": true,
  "articles": [
    {
      "_id": "64e8f6b2c2a7f3d1e5b4a9ec",
      "title": "How to Burp Your Baby",
      "category": "feeding",
      "content": "Burping helps prevent gas. Hold baby upright..."
    }
  ]
}
```

#### Filter by Category
```
GET /api/articles?category=feeding
Auth: Not required

Response (200):
{
  "ok": true,
  "articles": [ /* articles in feeding category */ ]
}
```

#### Search Articles
```
GET /api/articles?search=sleep
Auth: Not required

Response (200):
{
  "ok": true,
  "articles": [ /* articles matching "sleep" */ ]
}
```

#### Bookmark Article
```
POST /api/articles/bookmark
Auth: Required ✅
Content-Type: application/json

Request Body:
{
  "articleId": "64e8f6b2c2a7f3d1e5b4a9ec"
}

Response (200):
{
  "ok": true,
  "bookmarked": true
}
```

---

### **6️⃣ AI ASSISTANT**

#### Ask AI Question
```
POST /api/ai/ask
Auth: Required ✅
Content-Type: application/json

Request Body:
{
  "babyId": "64e8f6b2c2a7f3d1e5b4a9d9",
  "question": "My baby has 38°C fever, what should I do?"
}

Response (200):
{
  "ok": true,
  "answer": {
    "_id": "64e8f6b2c2a7f3d1e5b4a9ed",
    "userId": "64e8f6b2c2a7f3d1e5b4a9c8",
    "babyId": "64e8f6b2c2a7f3d1e5b4a9d9",
    "question": "My baby has 38°C fever, what should I do?",
    "response": "Fever in babies can be normal. Monitor for other symptoms. Give infant paracetamol if needed. IMPORTANT: Always consult your pediatrician.",
    "createdAt": "2026-07-24T12:41:21.694Z"
  }
}
```

#### Get AI Chat History
```
GET /api/ai/history?babyId=64e8f6b2c2a7f3d1e5b4a9d9
Auth: Required ✅

Response (200):
{
  "ok": true,
  "history": [
    { /* question/answer 1 */ },
    { /* question/answer 2 */ }
  ]
}
```

---

### **Error Response Format**

All errors follow this format:
```
{
  "ok": false,
  "error": "Description of the error"
}
```

Common errors:
- `400` - Bad request (invalid data)
- `401` - Unauthorized (missing/invalid JWT)
- `404` - Not found
- `500` - Server error

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** v16+ and npm
- **MongoDB Atlas** account with connection string (or local MongoDB)
- **Git** for cloning the repository

### Setup Backend (Server)

1. **Navigate to server folder**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in `server/` folder
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/mamacare?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_key_here_change_in_production
   ```
   Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your MongoDB Atlas credentials.

4. **Seed the database** (articles)
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Setup Frontend (Client)

1. **Navigate to client folder** (in a new terminal)
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

### Test End-to-End Flow

1. Open `http://localhost:5173` in your browser
2. Click **Register** → create account with email + password
3. Click **Add Baby** → fill in baby details (name, DOB, gender, blood type, weight, height)
4. See baby appear on **Dashboard**
5. Try **View Vaccines** → see UAE MOH schedule by age
6. (Coming soon) Try **Add Log**, **Ask AI**, **Read Articles**

### Verify Backend is Running

Test with curl:
```bash
# Get all articles (no auth needed)
curl http://localhost:5000/api/articles

# Should return: { "ok": true, "articles": [...] }
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `MONGO_URI not set` | Check `.env` file exists with correct MongoDB connection string |
| `Connection refused on localhost:5000` | Ensure `npm run dev` is running in server folder |
| `CORS error in browser console` | Backend may not be running; start with `npm run dev` |
| `Token expired` | Delete token from localStorage or re-register: `localStorage.clear()` |
| `Cannot read property 'babyId'` | Ensure request body includes all required fields |

---

## 📄 License

MIT License - see LICENSE file

## 👩‍💻 Developer

Built as a portfolio project to demonstrate full-stack development with React, Node.js, MongoDB, and JWT authentication.

---

**Last Updated:** 2026-07-24
