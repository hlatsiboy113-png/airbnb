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

  it('applies price range, guest capacity, rating, type, and amenities filters together', async () => {
    const populateMock = jest.fn().mockResolvedValue([]);
    Accommodation.find.mockReturnValue({ populate: populateMock });

    await request(app).get('/api/accommodations').query({
      minPrice: '100',
      maxPrice: '300',
      guests: '4',
      minRating: '4.5',
      type: 'Entire place',
      amenities: 'wifi,pool',
    });

    const passedFilter = Accommodation.find.mock.calls[0][0];
    expect(passedFilter.price).toEqual({ $gte: 100, $lte: 300 });
    expect(passedFilter.guests).toEqual({ $gte: 4 });
    expect(passedFilter.rating).toEqual({ $gte: 4.5 });
    expect(passedFilter.type.source).toBe('^Entire place$');
    expect(passedFilter.amenities).toEqual({ $all: ['wifi', 'pool'] });
  });

  it('ignores non-numeric price/guests/rating query values instead of erroring', async () => {
    const populateMock = jest.fn().mockResolvedValue([]);
    Accommodation.find.mockReturnValue({ populate: populateMock });

    const res = await request(app)
      .get('/api/accommodations')
      .query({ minPrice: 'not-a-number', guests: 'abc', minRating: 'nope' });

    expect(res.status).toBe(200);
    const passedFilter = Accommodation.find.mock.calls[0][0];
    expect(passedFilter.price).toBeUndefined();
    expect(passedFilter.guests).toBeUndefined();
    expect(passedFilter.rating).toBeUndefined();
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
