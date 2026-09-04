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

  it('rejects a valid password when the selected sign-in role does not match (403)', async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: 'user1',
        role: 'host',
        matchPassword: jest.fn().mockResolvedValue(true),
      }),
    });

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'jane@example.com', password: 'password321', role: 'guest' });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/registered as a host/i);
  });
});

describe('POST /api/users/register', () => {
  afterEach(() => jest.clearAllMocks());

  it('rejects incomplete registration data (400)', async () => {
    const res = await request(app).post('/api/users/register').send({ email: 'new@example.com' });
    expect(res.status).toBe(400);
  });

  it('rejects a duplicate email (409)', async () => {
    User.findOne.mockResolvedValue({ email: 'existing@example.com' });
    const res = await request(app).post('/api/users/register').send({
      username: 'Existing User',
      email: 'existing@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(409);
  });

  it('creates a tenant and returns a usable JWT (201)', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: 'new-user',
      username: 'New User',
      email: 'new@example.com',
      role: 'user',
    });
    const res = await request(app).post('/api/users/register').send({
      username: 'New User',
      email: 'new@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('user');
    expect(jwt.verify(res.body.token, process.env.JWT_SECRET).userId).toBe('new-user');
  });

  it('creates a host account when host registration is requested (201)', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: 'new-host',
      username: 'New Host',
      email: 'host@example.com',
      role: 'host',
    });

    const res = await request(app).post('/api/users/register').send({
      username: 'New Host',
      email: 'host@example.com',
      password: 'password123',
      role: 'host',
    });

    expect(res.status).toBe(201);
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ role: 'host' }));
    expect(res.body.user.role).toBe('host');
  });

  it('never creates a public administrator account from registration input (201)', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: 'safe-user',
      username: 'Attempted Admin',
      email: 'attempt@example.com',
      role: 'user',
    });

    const res = await request(app).post('/api/users/register').send({
      username: 'Attempted Admin',
      email: 'attempt@example.com',
      password: 'password123',
      role: 'admin',
    });

    expect(res.status).toBe(201);
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ role: 'user' }));
    expect(res.body.user.role).toBe('user');
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
