jest.mock('../models/Accommodation');
jest.mock('../models/User');

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Accommodation = require('../models/Accommodation');
const User = require('../models/User');
const app = require('../app');

const authHeaderFor = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return `Bearer ${token}`;
};

describe('GET /api/accommodations', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns a list on success (200)', async () => {
    Accommodation.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([{ _id: 'a1', title: 'Loft' }]),
    });
    const res = await request(app).get('/api/accommodations');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('does not throw a 500 when the location filter contains regex metacharacters', async () => {
    // Before the fix, `new RegExp(location, 'i')` with an unescaped
    // malformed pattern like '(' would throw a SyntaxError and 500.
    const populateMock = jest.fn().mockResolvedValue([]);
    Accommodation.find.mockReturnValue({ populate: populateMock });

    const res = await request(app).get('/api/accommodations').query({ location: '(unclosed' });
    expect(res.status).toBe(200);

    // Confirm the pattern actually reached Mongoose escaped, not raw.
    const passedFilter = Accommodation.find.mock.calls[0][0];
    expect(passedFilter.location.source).toBe('\\(unclosed');
  });

  it('applies a minimum guest count filter when the guests query is present', async () => {
    Accommodation.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([{ _id: 'a1', title: 'Villa', guests: 6 }]),
    });

    const res = await request(app).get('/api/accommodations').query({ location: 'Cape Town', guests: '4' });
    expect(res.status).toBe(200);

    const passedFilter = Accommodation.find.mock.calls[0][0];
    expect(passedFilter.guests).toEqual({ $gte: 4 });
  });

  it('omits the guest filter when guests is absent or not greater than 1', async () => {
    Accommodation.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([]) });

    const res = await request(app).get('/api/accommodations').query({ guests: '1' });
    expect(res.status).toBe(200);

    const passedFilter = Accommodation.find.mock.calls[0][0];
    expect(passedFilter).not.toHaveProperty('guests');
  });
});

describe('GET /api/accommodations/:id', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns 404 when no accommodation is found', async () => {
    Accommodation.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
    const res = await request(app).get('/api/accommodations/507f1f77bcf86cd799439011');
    expect(res.status).toBe(404);
  });

  it('returns 400 (not 500) for a malformed ObjectId, via the CastError handler', async () => {
    const castError = new mongoose.Error.CastError('ObjectId', 'not-a-valid-id', '_id');
    Accommodation.findById.mockReturnValue({ populate: jest.fn().mockRejectedValue(castError) });

    const res = await request(app).get('/api/accommodations/not-a-valid-id');
    expect(res.status).toBe(400);
  });

  it('returns the accommodation on success (200)', async () => {
    Accommodation.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({ _id: 'a1', title: 'Loft' }),
    });
    const res = await request(app).get('/api/accommodations/507f1f77bcf86cd799439011');
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Loft');
  });
});

describe('POST /api/accommodations (auth + role gating)', () => {
  afterEach(() => jest.clearAllMocks());

  it('rejects an unauthenticated request (401)', async () => {
    const res = await request(app).post('/api/accommodations').send({ title: 'x' });
    expect(res.status).toBe(401);
  });

  it('rejects a logged-in guest (role "user") with 403', async () => {
    User.findById.mockResolvedValue({ _id: 'u1', role: 'user' });
    const res = await request(app)
      .post('/api/accommodations')
      .set('Authorization', authHeaderFor('u1'))
      .send({ title: 'x', location: 'y', price: 100 });
    expect(res.status).toBe(403);
  });

  it('allows a host to create a listing (201)', async () => {
    User.findById.mockResolvedValue({ _id: 'u1', role: 'host' });
    Accommodation.create.mockResolvedValue({ _id: 'a1', title: 'New Place', host: 'u1' });

    const res = await request(app)
      .post('/api/accommodations')
      .set('Authorization', authHeaderFor('u1'))
      .field('title', 'New Place')
      .field('location', 'Cape Town')
      .field('price', '500');

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('New Place');
  });
});

describe('PUT /api/accommodations/:id (auth + ownership)', () => {
  afterEach(() => jest.clearAllMocks());

  it('rejects an unauthenticated request (401)', async () => {
    const res = await request(app)
      .put('/api/accommodations/507f1f77bcf86cd799439011')
      .field('title', 'x');
    expect(res.status).toBe(401);
  });

  it('rejects a logged-in guest (403)', async () => {
    User.findById.mockResolvedValue({ _id: 'u1', role: 'user' });
    const res = await request(app)
      .put('/api/accommodations/507f1f77bcf86cd799439011')
      .set('Authorization', authHeaderFor('u1'))
      .field('title', 'x');
    expect(res.status).toBe(403);
  });

  it('rejects a host who does not own the listing (403)', async () => {
    User.findById.mockResolvedValue({ _id: 'u2', role: 'host' });
    Accommodation.findById.mockResolvedValue({ _id: 'a1', host: 'u1' });

    const res = await request(app)
      .put('/api/accommodations/a1')
      .set('Authorization', authHeaderFor('u2'))
      .field('title', 'Takeover attempt');

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/not authorized/i);
    expect(Accommodation.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('allows the owning host to update their listing (200)', async () => {
    User.findById.mockResolvedValue({ _id: 'u1', role: 'host' });
    Accommodation.findById.mockResolvedValue({ _id: 'a1', host: 'u1' });
    Accommodation.findByIdAndUpdate.mockResolvedValue({ _id: 'a1', title: 'Updated Place', host: 'u1' });

    const res = await request(app)
      .put('/api/accommodations/a1')
      .set('Authorization', authHeaderFor('u1'))
      .field('title', 'Updated Place');

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Updated Place');
    expect(Accommodation.findByIdAndUpdate).toHaveBeenCalled();
  });

  it('allows an admin to update another host\'s listing (200)', async () => {
    User.findById.mockResolvedValue({ _id: 'admin1', role: 'admin' });
    Accommodation.findById.mockResolvedValue({ _id: 'a1', host: 'u1' });
    Accommodation.findByIdAndUpdate.mockResolvedValue({ _id: 'a1', title: 'Admin Editorial', host: 'u1' });

    const res = await request(app)
      .put('/api/accommodations/a1')
      .set('Authorization', authHeaderFor('admin1'))
      .field('title', 'Admin Editorial');

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Admin Editorial');
  });

  it('returns 404 when the listing does not exist', async () => {
    User.findById.mockResolvedValue({ _id: 'u1', role: 'host' });
    Accommodation.findById.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/accommodations/507f1f77bcf86cd799439011')
      .set('Authorization', authHeaderFor('u1'))
      .field('title', 'x');

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/accommodations/:id (auth + ownership)', () => {
  afterEach(() => jest.clearAllMocks());

  it('rejects an unauthenticated request (401)', async () => {
    const res = await request(app).delete('/api/accommodations/507f1f77bcf86cd799439011');
    expect(res.status).toBe(401);
  });

  it('rejects a host who does not own the listing (403)', async () => {
    User.findById.mockResolvedValue({ _id: 'u2', role: 'host' });
    Accommodation.findById.mockResolvedValue({ _id: 'a1', host: 'u1' });

    const res = await request(app)
      .delete('/api/accommodations/a1')
      .set('Authorization', authHeaderFor('u2'));

    expect(res.status).toBe(403);
    expect(Accommodation.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it('rejects a guest (403) even when the listing exists', async () => {
    User.findById.mockResolvedValue({ _id: 'g1', role: 'user' });
    Accommodation.findById.mockResolvedValue({ _id: 'a1', host: 'u1' });

    const res = await request(app)
      .delete('/api/accommodations/a1')
      .set('Authorization', authHeaderFor('g1'));

    expect(res.status).toBe(403);
  });

  it('allows the owning host to delete their listing (200)', async () => {
    User.findById.mockResolvedValue({ _id: 'u1', role: 'host' });
    Accommodation.findById.mockResolvedValue({ _id: 'a1', host: 'u1' });
    Accommodation.findByIdAndDelete.mockResolvedValue({ _id: 'a1' });

    const res = await request(app)
      .delete('/api/accommodations/a1')
      .set('Authorization', authHeaderFor('u1'));

    expect(res.status).toBe(200);
    expect(Accommodation.findByIdAndDelete).toHaveBeenCalledWith('a1');
  });

  it('allows an admin to delete any listing (200)', async () => {
    User.findById.mockResolvedValue({ _id: 'admin1', role: 'admin' });
    Accommodation.findById.mockResolvedValue({ _id: 'a1', host: 'u1' });
    Accommodation.findByIdAndDelete.mockResolvedValue({ _id: 'a1' });

    const res = await request(app)
      .delete('/api/accommodations/a1')
      .set('Authorization', authHeaderFor('admin1'));

    expect(res.status).toBe(200);
    expect(Accommodation.findByIdAndDelete).toHaveBeenCalledWith('a1');
  });
});
