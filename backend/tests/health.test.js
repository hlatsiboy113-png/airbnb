const request = require('supertest');
const app = require('../app');

describe('app.js (no database required)', () => {
  it('GET /health returns 200 and a success payload', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });

  it('GET an undefined route returns the JSON 404 handler, not an HTML error page', async () => {
    const res = await request(app).get('/this-route-does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toBe('Route not found');
  });

  it('GET / (bare root) returns 404 via the catch-all, since no frontend is served from the API host', async () => {
    // This mirrors the real production behaviour observed on the live Render
    // backend (https://airbnb-zq1x.onrender.com/ returns 404) — confirms
    // that response is expected/correct, not a deployment bug.
    const res = await request(app).get('/');
    expect(res.status).toBe(404);
  });
});
