const request = require('supertest');

// Mock Supabase agar test tidak butuh koneksi database
jest.mock('../config/supabase', () => ({
    from: jest.fn(() => ({
        select: jest.fn(() => Promise.resolve({ data: [], error: null })),
        ilike: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
}));

const app = require('../app');

describe('API Endpoints', () => {
    test('GET / returns status 200', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
    });

    test('GET /api/tools returns status 200', async () => {
        const res = await request(app).get('/api/tools');
        expect(res.status).toBe(200);
    });
});
