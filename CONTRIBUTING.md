# 🤝 Contributing to MamaCare

Thank you for helping make MamaCare better! This guide explains how to contribute code, report bugs, and suggest features.

---

## 📋 Prerequisites

- Node.js v16+
- npm or yarn
- Git
- MongoDB Atlas account
- Basic knowledge of React, Express, and MongoDB

---

## 🔧 Development Setup

### 1. Clone Repository
```bash
git clone <your-fork-url>
cd mamacare
```

### 2. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Setup Environment Variables
```bash
# server/.env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_dev_secret_key
NODE_ENV=development

# client/.env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Start Development Servers
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 5. Verify Setup
- Backend: http://localhost:5000/health (should return status: OK)
- Frontend: http://localhost:5174 (should load MamaCare homepage)

---

## 📝 Code Style Guidelines

### JavaScript/React
```javascript
// ✅ Good
const fetchBabies = async (userId) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`http://localhost:5000/api/babies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.ok ? data.babies : [];
  } catch (err) {
    console.error('Error fetching babies:', err);
    return [];
  }
};

// ❌ Avoid
function fetchBabies(userId) {
  let token = localStorage.getItem('token');
  let res = fetch('http://localhost:5000/api/babies', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  // Missing error handling, async/await
}
```

### React Components
- Use functional components with hooks
- Keep components focused and small (<300 lines)
- Lift state up when needed
- Use descriptive component names
- Add comments for complex logic only

### Express Routes
```javascript
// ✅ Good
router.post('/logs', authMiddleware, async (req, res) => {
  try {
    const { babyId } = req.body;
    if (!babyId) return res.status(400).json({ ok: false, error: 'babyId required' });
    
    const isOwner = await verifyBabyOwnership(babyId, req.user.id);
    if (!isOwner) return res.status(403).json({ ok: false, error: 'Not authorized' });
    
    const log = await Log.create(req.body);
    res.json({ ok: true, log });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});
```

### Naming Conventions
- **Files:** camelCase or PascalCase (Models use PascalCase)
- **Variables:** camelCase
- **Constants:** UPPER_SNAKE_CASE
- **Components:** PascalCase
- **Functions:** camelCase or camelCaseWithVerb (e.g., `fetchBabies`, `createLog`)

### Tailwind CSS
- Use existing color palette: pink, purple, green, blue, orange, red
- Mobile-first approach (sm: breakpoint for tablet+)
- Use utility classes, avoid custom CSS
- Reuse component patterns for consistency

---

## 🎯 Feature Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
# Example: feature/vaccine-reminders
```

### 2. Implement Feature
- Write code incrementally
- Test locally frequently
- Keep commits small and focused
- Update documentation

### 3. Testing Checklist
- [ ] Feature works on desktop browser
- [ ] Feature works on mobile browser (iPhone/Android)
- [ ] No console errors
- [ ] API responses match schema
- [ ] Authorization checks work (if needed)
- [ ] Form validation works
- [ ] Error messages are clear

### 4. Commit Messages
```
git commit -m "Feature: Add vaccine reminders

- Send email 1 week before vaccine due
- Store reminder preferences per baby
- Add toggle in baby profile settings

Fixes #123"
```

**Format:** `Type: Brief description`
- **Types:** Feature, Fix, Refactor, Docs, Style, Test, Chore
- **Description:** Clear, imperative tense
- **Body:** Detailed explanation (optional)
- **Footer:** Reference issues (Fixes #123)

### 5. Push & Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create PR on GitHub with:
- Clear title
- Description of changes
- Testing steps
- Screenshots (if UI changes)

---

## 🐛 Bug Fix Workflow

### 1. Report Bug (Create Issue)
```
Title: [Bug] Brief description
Description:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs
```

### 2. Create Bug Fix Branch
```bash
git checkout -b fix/bug-name
# Example: fix/logs-datetime-bug
```

### 3. Fix & Test
- Reproduce bug locally
- Implement fix
- Test fix resolves issue
- Check no new bugs introduced

### 4. Commit & PR
```bash
git commit -m "Fix: Logs datetime parsing error

- Parse ISO 8601 format correctly
- Handle timezone offsets
- Add unit tests

Fixes #456"
```

---

## 📚 Documentation

### README Updates
- Keep tech stack current
- Update API docs if endpoints change
- Add new features to feature list
- Update "How to Run" with new steps

### Code Comments
Only comment when necessary:
```javascript
// ✅ Good - Complex business logic
const calculateAge = (dob) => {
  // Calculate months/weeks/days since birth for UAE MOH vaccine scheduling
  const today = new Date();
  const birthDate = new Date(dob);
  const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                 (today.getMonth() - birthDate.getMonth());
  // ...
};

// ❌ Avoid - Obvious code
const babies = []; // Create empty array
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Register new user
- [ ] Login with credentials
- [ ] Add multiple babies
- [ ] Create logs (feeding/diaper/sleep)
- [ ] View logs by date
- [ ] Mark vaccine done
- [ ] Search and bookmark articles
- [ ] Ask AI question
- [ ] View stats dashboard
- [ ] Logout and verify redirect

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Network Testing
- Use DevTools Network tab
- Verify API calls return correct status (200, 400, 401, etc.)
- Check response times (<500ms ideal)
- Test with slow network (DevTools > Network > Slow 3G)

---

## 🔒 Security Checklist

Before committing:
- [ ] No sensitive data in code (API keys, passwords)
- [ ] No console.log statements with sensitive data
- [ ] Input validation on all forms
- [ ] XSS prevention (React auto-escapes)
- [ ] CSRF protection (if forms needed)
- [ ] Password hashing checked (bcryptjs)
- [ ] JWT tokens never logged
- [ ] Environment variables used for secrets

---

## 📦 Adding Dependencies

### Backend
```bash
cd server
npm install package-name
# Commit package-lock.json
git add package.json package-lock.json
git commit -m "Chore: Add new-package for feature X"
```

### Frontend
```bash
cd client
npm install package-name
# Only add if necessary - keep bundle size small
git add package.json package-lock.json
git commit -m "Chore: Add new-package for feature X"
```

### Check Bundle Size
```bash
# Frontend
cd client
npm run build
# Check "dist/" folder size
```

---

## 🚀 Deployment Process

Before merging to main:
1. All tests pass
2. Code review approved
3. No breaking changes
4. Documentation updated
5. CHANGELOG updated

After merge:
1. Deploy to staging (if available)
2. Test in staging
3. Deploy to production

---

## 💡 Feature Request Process

### Create Feature Request
```
Title: [Feature] Brief description
Category: (UI/Backend/Database/DevOps)
Description: Detailed explanation
Use Cases: Why is this needed?
Acceptance Criteria:
- [ ] User can do X
- [ ] System responds with Y
- [ ] Performance is <Z ms
```

### Implementation Steps
1. Discuss in issue/PR comments
2. Get approval before starting
3. Create feature branch
4. Implement with tests
5. Create PR with description
6. Deploy after approval

---

## 🆘 Getting Help

- **Questions:** Open a GitHub discussion
- **Bug Reports:** Create an issue with reproduction steps
- **Security Issues:** Email (don't create public issue)
- **Code Review:** Request in PR comments

---

## 📋 Contributor License Agreement

By contributing, you agree that:
- Your contributions are your own original work
- You grant the project a perpetual license to use your code
- You understand the project is open source (MIT License)

---

## 🎉 Recognition

Contributors will be:
- Added to README Contributors section
- Mentioned in release notes
- Given credit in commits

---

**Thank you for making MamaCare better! 💙**
