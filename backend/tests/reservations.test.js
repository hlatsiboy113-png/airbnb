jest.mock('../models/Reservation');
jest.mock('../models/Accommodation');
jest.mock('../models/User');

const request = require('supertest');
const jwt = require('jsonwebtoken');
const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');
const User = require('../models/User');
const app = require('../app');

const authHeaderFor = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return `Bearer ${token}`;
};

beforeEach(() => {
  User.findById.mockResolvedValue({ _id: 'guest1', role: 'user' });
});

afterEach(() => jest.clearAllMocks());

describe('POST /api/reservations', () => {
  it('rejects an unauthenticated request (401)', async () => {
    const res = await request(app).post('/api/reservations').send({});
    expect(res.status).toBe(401);
  });

  it('rejects a guest count above the accommodation capacity (400)', async () => {
    Accommodation.findById.mockResolvedValue({
      _id: 'acc1',
      price: 100,
      guests: 2,
      weeklyDiscount: 0,
      cleaningFee: 0,
      serviceFee: 0,
      occupancyTaxes: 0,
      host: 'host1',
    });

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', authHeaderFor('guest1'))
      .send({
        accommodation: 'acc1',
        checkIn: '2026-10-01',
        checkOut: '2026-10-03',
        guests: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/2 guests/);
    expect(Reservation.create).not.toHaveBeenCalled();
  });

  it('rejects checkout on/before checkin (400)', async () => {
    Accommodation.findById.mockResolvedValue({
      _id: 'acc1',
      price: 100,
      guests: 4,
      weeklyDiscount: 0,
      cleaningFee: 0,
      serviceFee: 0,
      occupancyTaxes: 0,
      host: 'host1',
    });

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', authHeaderFor('guest1'))
      .send({
        accommodation: 'acc1',
        checkIn: '2026-10-05',
        checkOut: '2026-10-03',
        guests: 2,
      });

    expect(res.status).toBe(400);
  });

  it('creates a reservation with the correct total cost breakdown (201)', async () => {
    Accommodation.findById.mockResolvedValue({
      _id: 'acc1',
      price: 100,
      guests: 4,
      weeklyDiscount: 20,
      cleaningFee: 30,
      serviceFee: 15,
      occupancyTaxes: 10,
      host: 'host1',
    });
    Reservation.create.mockResolvedValue({
      _id: 'r1',
      totalCost: 235,
      populate: jest.fn().mockResolvedValue({ _id: 'r1', totalCost: 235 }),
    });

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', authHeaderFor('guest1'))
      .send({
        accommodation: 'acc1',
        checkIn: '2026-10-01',
        checkOut: '2026-10-03', // 2 nights
        guests: 2,
      });

    // base = 100 * 2 = 200; total = 200 - 20 + 30 + 15 + 10 = 235
    expect(res.status).toBe(201);
    expect(Reservation.create).toHaveBeenCalledWith(
      expect.objectContaining({ totalCost: 235, guests: 2 })
    );
  });

  it('rejects an overlapping reservation for the same accommodation (400)', async () => {
    Accommodation.findById.mockResolvedValue({
      _id: 'acc1',
      price: 100,
      guests: 4,
      weeklyDiscount: 0,
      cleaningFee: 0,
      serviceFee: 0,
      occupancyTaxes: 0,
      host: 'host1',
    });
    Reservation.findOne.mockResolvedValue({ _id: 'existing-reservation' });

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', authHeaderFor('guest1'))
      .send({
        accommodation: 'acc1',
        checkIn: '2026-10-01',
        checkOut: '2026-10-03',
        guests: 2,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already booked/i);
    expect(Reservation.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        accommodation: 'acc1',
        status: { $ne: 'cancelled' },
      })
    );
    expect(Reservation.create).not.toHaveBeenCalled();
  });

  it('allows a non-overlapping reservation (201)', async () => {
    Accommodation.findById.mockResolvedValue({
      _id: 'acc1',
      price: 100,
      guests: 4,
      weeklyDiscount: 0,
      cleaningFee: 30,
      serviceFee: 15,
      occupancyTaxes: 10,
      host: 'host1',
    });
    Reservation.findOne.mockResolvedValue(null);
    Reservation.create.mockResolvedValue({
      _id: 'r2',
      totalCost: 255,
      populate: jest.fn().mockResolvedValue({ _id: 'r2', totalCost: 255 }),
    });

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', authHeaderFor('guest1'))
      .send({
        accommodation: 'acc1',
        checkIn: '2026-11-01',
        checkOut: '2026-11-03',
        guests: 2,
      });

    expect(res.status).toBe(201);
    expect(Reservation.create).toHaveBeenCalled();
  });

  it('rejects a reservation whose check-in date is in the past (400)', async () => {
    Accommodation.findById.mockResolvedValue({
      _id: 'acc1',
      price: 100,
      guests: 4,
      weeklyDiscount: 0,
      cleaningFee: 0,
      serviceFee: 0,
      occupancyTaxes: 0,
      host: 'host1',
    });
    Reservation.findOne.mockResolvedValue(null);

    const pastCheckIn = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const futureCheckOut = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', authHeaderFor('guest1'))
      .send({
        accommodation: 'acc1',
        checkIn: pastCheckIn,
        checkOut: futureCheckOut,
        guests: 2,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/future/i);
    expect(Reservation.create).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/reservations/:id', () => {
  it('rejects a user who is neither the reservation owner, the host, nor an admin (403)', async () => {
    Reservation.findById.mockResolvedValue({
      _id: 'r1',
      user: { toString: () => 'someone-else' },
      host: { toString: () => 'another-host' },
    });

    const res = await request(app)
      .delete('/api/reservations/r1')
      .set('Authorization', authHeaderFor('guest1'));

    expect(res.status).toBe(403);
    expect(Reservation.findByIdAndDelete).not.toHaveBeenCalled();
  });

  it('allows the reservation owner to cancel it (200)', async () => {
    Reservation.findById.mockResolvedValue({
      _id: 'r1',
      user: { toString: () => 'guest1' },
      host: { toString: () => 'host1' },
    });
    Reservation.findByIdAndDelete.mockResolvedValue({});

    const res = await request(app)
      .delete('/api/reservations/r1')
      .set('Authorization', authHeaderFor('guest1'));

    expect(res.status).toBe(200);
  });
});

describe('GET /api/reservations/user', () => {
  it('returns only the authenticated user\'s reservations (200)', async () => {
    User.findById.mockResolvedValue({ _id: 'guest1', role: 'user' });
    Reservation.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([{ _id: 'r1', user: 'guest1' }]),
      }),
    });

    const res = await request(app)
      .get('/api/reservations/user')
      .set('Authorization', authHeaderFor('guest1'));

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(Reservation.find).toHaveBeenCalledWith(
      expect.objectContaining({ user: 'guest1' })
    );
  });

  it('returns an empty array for a user with no reservations (200)', async () => {
    User.findById.mockResolvedValue({ _id: 'guest1', role: 'user' });
    Reservation.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      }),
    });

    const res = await request(app)
      .get('/api/reservations/user')
      .set('Authorization', authHeaderFor('guest1'));

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});

describe('PUT /api/reservations/:id', () => {
  it('allows the owner to update a valid future reservation (200)', async () => {
    User.findById.mockResolvedValue({ _id: 'guest1', role: 'user' });
    Reservation.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: 'r1',
        user: { toString: () => 'guest1' },
        checkIn: new Date('2026-12-01'),
        accommodation: { _id: 'acc1', price: 100, guests: 4, weeklyDiscount: 0, cleaningFee: 0, serviceFee: 0, occupancyTaxes: 0 },
        save: jest.fn().mockImplementation(function () { return Promise.resolve(this); }),
        populate: jest.fn().mockResolvedValue({ _id: 'r1', user: 'guest1' }),
      }),
    });

    const res = await request(app)
      .put('/api/reservations/r1')
      .set('Authorization', authHeaderFor('guest1'))
      .send({ checkIn: '2026-12-05', checkOut: '2026-12-08', guests: 2 });

    expect(res.status).toBe(200);
  });

  it('rejects a non-owner with 403', async () => {
    User.findById.mockResolvedValue({ _id: 'guest1', role: 'user' });
    Reservation.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: 'r1',
        user: { toString: () => 'someone-else' },
        checkIn: new Date('2026-12-01'),
      }),
    });

    const res = await request(app)
      .put('/api/reservations/r1')
      .set('Authorization', authHeaderFor('guest1'))
      .send({ checkIn: '2026-12-05', checkOut: '2026-12-08', guests: 2 });

    expect(res.status).toBe(403);
  });

  it('rejects updating a reservation whose check-in has passed (400)', async () => {
    User.findById.mockResolvedValue({ _id: 'guest1', role: 'user' });
    Reservation.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: 'r1',
        user: { toString: () => 'guest1' },
        checkIn: new Date(Date.now() - 86400000),
      }),
    });

    const res = await request(app)
      .put('/api/reservations/r1')
      .set('Authorization', authHeaderFor('guest1'))
      .send({ checkIn: '2026-12-05', checkOut: '2026-12-08', guests: 2 });

    expect(res.status).toBe(400);
  });

  it('rejects an update that overlaps another reservation (400)', async () => {
    User.findById.mockResolvedValue({ _id: 'guest1', role: 'user' });
    Reservation.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: 'r1',
        user: { toString: () => 'guest1' },
        checkIn: new Date('2026-12-01'),
        accommodation: { _id: 'acc1', price: 100, guests: 4 },
      }),
    });
    Reservation.findOne.mockResolvedValue({ _id: 'r2' });

    const res = await request(app)
      .put('/api/reservations/r1')
      .set('Authorization', authHeaderFor('guest1'))
      .send({ checkIn: '2026-12-05', checkOut: '2026-12-08', guests: 2 });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already booked/i);
  });
});


describe('GET /api/reservations/host/stats', () => {
  it('returns host reservation, earnings, and upcoming metrics (200)', async () => {
    User.findById.mockResolvedValue({ _id: 'host1', role: 'host' });
    Reservation.countDocuments
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(3);
    Reservation.aggregate.mockResolvedValue([{ _id: null, total: 1250 }]);

    const res = await request(app)
      .get('/api/reservations/host/stats')
      .set('Authorization', authHeaderFor('host1'));

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({
      totalReservations: 8,
      totalEarnings: 1250,
      upcomingReservations: 3,
    });
  });

  it('rejects a guest (403)', async () => {
    const res = await request(app)
      .get('/api/reservations/host/stats')
      .set('Authorization', authHeaderFor('guest1'));

    expect(res.status).toBe(403);
  });
});
