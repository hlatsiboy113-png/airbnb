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
