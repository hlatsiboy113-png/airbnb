jest.mock('../models/User');

const request = require('supertest');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const app = require('../app');

describe('POST /api/users/login', () => {
  afterEach(() => jest.clearAllMocks());

  it('rejects a request with missing email/password (400)', async () => {
    const res = await request(app).post('/api/users/login').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  it('rejects invalid credentials (401) when no user is found', async () => {
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'nobody@example.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('rejects invalid credentials (401) when the password does not match', async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: 'user1',
        matchPassword: jest.fn().mockResolvedValue(false),
      }),
    });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'jane@example.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('logs in successfully and returns a usable JWT + user payload (200)', async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: 'user1',
        username: 'jane',
        email: 'jane@example.com',
        role: 'host',
        matchPassword: jest.fn().mockResolvedValue(true),
      }),
    });

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'jane@example.com', password: 'password321' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user).toEqual(
      expect.objectContaining({ username: 'jane', role: 'host' })
    );

    // The token returned must actually verify with the configured secret —
    // exercises the real jwt.sign/verify round trip, not just the mock.
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.userId).toBe('user1');
  });
});

describe('GET /api/users/me', () => {
  afterEach(() => jest.clearAllMocks());

  it('rejects a request with no Authorization header (401)', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });

  it('rejects a request with a malformed/invalid token (401)', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });

  it('returns the current user profile for a valid token (200)', async () => {
    const token = jwt.sign({ userId: 'user1' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    User.findById.mockResolvedValue({
      _id: 'user1',
      username: 'jane',
      email: 'jane@example.com',
      role: 'host',
    });

    const res = await request(app).get('/api/users/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(
      expect.objectContaining({ username: 'jane', role: 'host' })
    );
  });

  it('rejects an expired token (401)', async () => {
    const token = jwt.sign({ userId: 'user1' }, process.env.JWT_SECRET, { expiresIn: '-1s' });
    const res = await request(app).get('/api/users/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});

describe('POST /api/users/seed', () => {
  const originalEnv = process.env.NODE_ENV;
  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.clearAllMocks();
  });

  it('is blocked (404) when NODE_ENV=production', async () => {
    process.env.NODE_ENV = 'production';
    const res = await request(app).post('/api/users/seed');
    expect(res.status).toBe(404);
  });

  it('is available outside production', async () => {
    process.env.NODE_ENV = 'test';
    User.deleteMany.mockResolvedValue({});
    User.create.mockResolvedValue([{ _id: '1' }, { _id: '2' }, { _id: '3' }]);
    const res = await request(app).post('/api/users/seed');
    expect(res.status).toBe(201);
  });
});
