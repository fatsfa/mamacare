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

## 📄 License

MIT License - see LICENSE file

## 👩‍💻 Developer

Built as a portfolio project to demonstrate full-stack development with React, Node.js, MongoDB, and JWT authentication.

---

**Last Updated:** 2026-07-23
