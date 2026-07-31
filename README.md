# 🌸 MamaCare — Baby Tracker & Mom Support App

> A mobile-first web app for new moms in the UAE to track their baby's daily life and get trusted support.

![MamaCare](https://img.shields.io/badge/MamaCare-Baby%20Tracker-pink?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=flat-square)

---

## 📖 About

MamaCare is a full-stack web application built for new mothers to:
- Track their baby's **feeding, diaper changes, and sleep** with live timers
- Follow the **UAE MOH vaccination schedule** and mark vaccines as done
- Get **AI-powered answers** to baby care questions (powered by Google Gemini)
- Read **curated articles** on feeding, sleep, health, and development
- View **daily and weekly stats** at a glance

> Built as a portfolio project to demonstrate full-stack skills with React, Node.js, MongoDB, and AI integration.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 Auth | Register/Login with JWT — secure protected routes |
| 👶 Baby Profile | Add multiple babies, auto-calculate age in months/weeks |
| 📝 Feeding Log | Live timer OR manual time entry, track duration + ml |
| 💩 Diaper Log | Single timestamp, potty done toggle |
| 😴 Sleep Log | Start/stop timer with total sleep duration |
| 💉 Vaccines | UAE MOH schedule, mark done, see upcoming/pending |
| 🤖 AI Help | Chat with Google Gemini AI for baby care guidance |
| 📚 Articles | 20+ pre-written articles: Feeding, Sleep, Health, Development |
| 📊 Stats | Today / This Week summary with progress bars |
| 📱 Mobile First | Soft pink/lavender UI, tap-friendly buttons |

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- Tailwind CSS

**Backend**
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT Authentication
- Google Generative AI (Gemini 2.0 Flash)

**Testing**
- Jest + Supertest (9 API tests)

**Deployment**
- Single Express server on Render
- Frontend built into `client/dist` and served by Express

---

## 🚀 Getting Started (Run Locally)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/app/apikey))

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/mamacare.git
cd mamacare
```

### 2. Setup the server
```bash
cd server
npm install
npm run build
```

This builds the React frontend into `client/dist` and lets the Express server serve the app for deployment.

Create `server/.env` file:
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/mamacare?retryWrites=true&w=majority
JWT_SECRET=your_strong_secret_key_here
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the server:
```bash
npm run dev
```

### 3. Setup the client
```bash
cd client
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Babies
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/babies` | Add a baby |
| GET | `/api/babies` | List user's babies |
| PUT | `/api/babies/:id` | Update baby |
| DELETE | `/api/babies/:id` | Delete baby |

### Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/logs` | Create log (feeding/diaper/sleep) |
| GET | `/api/logs?babyId=X&date=YYYY-MM-DD` | List logs by day |
| DELETE | `/api/logs/:id` | Delete log |

### Vaccines
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vaccines?babyId=X` | Get schedule + done vaccines |
| POST | `/api/vaccines/done` | Mark vaccine as done |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/ask` | Ask a baby care question |
| GET | `/api/ai/history` | Get past questions |

### Articles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | List all articles |
| GET | `/api/articles?category=sleep` | Filter by category |
| GET | `/api/articles?search=fever` | Search articles |

---

## 🧪 Running Tests

```bash
cd server
npm test
```

Output: **9 tests passing** covering auth register, login, and protected routes.

---

## 🌍 Deployment

| Service | Purpose |
|---------|---------|
| [Vercel](https://vercel.com) | React frontend |
| [Render](https://render.com) | Node.js backend |
| [MongoDB Atlas](https://mongodb.com/atlas) | Database |

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step guide.

---

## 📁 Project Structure

```
mamacare/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/           # Register, Login, Dashboard, Logs, Vaccines, etc.
│   │   ├── components/      # Navbar, Footer, ErrorBoundary
│   │   └── api.js           # API helper functions
│   └── package.json
│
└── server/                  # Node.js backend
    ├── models/              # User, Baby, Log, VaccineDone, Article, AIChat
    ├── routes/              # auth, babies, logs, vaccines, articles, ai
    ├── middleware/          # JWT auth middleware
    ├── data/                # UAE vaccine schedule JSON, articles JSON
    ├── tests/               # Jest + Supertest tests
    ├── app.js               # Express app (no server listen)
    └── index.js             # Server entry point
```

---

## 🔮 Future Features

- 📸 Baby photo upload
- 🔔 Push notifications for upcoming vaccines
- 📈 Growth charts (height/weight over time)
- 🌐 Arabic language support
- 👨‍👩‍👧 Multi-caregiver support (add dad/nanny)
- 📤 Export logs as PDF

---

## 👩‍💻 About the Developer

Built by a mom of a 6-month-old during 1 hour daily coding sessions — because moms can code too! 💪

This project demonstrates:
- Full-stack JavaScript (React + Node.js)
- RESTful API design
- MongoDB with Mongoose
- JWT authentication
- Third-party API integration (Google Gemini AI)
- Mobile-first responsive design
- Unit testing with Jest

---

## 📄 License

MIT License — see [LICENSE](LICENSE)
