require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

// Use a separate test DB so real data is never touched
const TEST_DB = process.env.MONGO_URI_TEST || process.env.MONGO_URI;

beforeAll(async () => {
  await mongoose.connect(TEST_DB);
});

afterAll(async () => {
  // Clean up test users created during tests
  await mongoose.connection.collection('users').deleteMany({ email: /@mamacare-test\.com$/ });
  await mongoose.disconnect();
});

describe('Health check', () => {
  it('GET /health returns OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});

describe('Auth — Register', () => {
  const testEmail = `test_${Date.now()}@mamacare-test.com`;

  it('registers a new user and returns a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test Mom', email: testEmail, password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testEmail);
  });

  it('rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Duplicate', email: testEmail, password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.error).toMatch(/already exists/i);
  });

  it('rejects missing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'No Email', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });
});

describe('Auth — Login', () => {
  const loginEmail = `login_${Date.now()}@mamacare-test.com`;
  const loginPass = 'testpass456';

  beforeAll(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Login Test', email: loginEmail, password: loginPass });
  });

  it('logs in with correct credentials and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: loginEmail, password: loginPass });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: loginEmail, password: 'wrongpassword' });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('rejects non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@mamacare-test.com', password: 'abc' });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });
});

describe('Auth — Protected route (/me)', () => {
  let token;
  const meEmail = `me_${Date.now()}@mamacare-test.com`;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Me Test', email: meEmail, password: 'mepass123' });
    token = res.body.token;
  });

  it('returns user info with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.user.email).toBe(meEmail);
  });

  it('rejects request without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
