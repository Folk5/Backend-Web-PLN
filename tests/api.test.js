const request = require('supertest');

const mockSelect = jest.fn().mockReturnThis();
const mockEq = jest.fn().mockReturnThis();
const mockIlike = jest.fn().mockReturnThis();
const mockOrder = jest.fn().mockReturnThis();
const mockSingle = jest.fn();
const mockInsert = jest.fn().mockReturnThis();
const mockDelete = jest.fn().mockReturnThis();
const mockUpdate = jest.fn().mockReturnThis();
const mockIn = jest.fn().mockReturnThis();

const mockFrom = jest.fn(() => ({
    select: mockSelect,
    eq: mockEq,
    ilike: mockIlike,
    order: mockOrder,
    single: mockSingle,
    insert: mockInsert,
    delete: mockDelete,
    update: mockUpdate,
    in: mockIn,
    then: function(resolve) {
        return Promise.resolve({ data: [], error: null }).then(resolve);
    }
}));

const mockSignUp = jest.fn();
const mockSignInWithPassword = jest.fn();
const mockGetUser = jest.fn();
const mockSignOut = jest.fn();
const mockUpload = jest.fn();
const mockGetPublicUrl = jest.fn();

jest.mock('../config/supabase', () => ({
    auth: {
        signUp: mockSignUp,
        signInWithPassword: mockSignInWithPassword,
        getUser: mockGetUser,
        admin: {
            signOut: mockSignOut,
        }
    },
    from: mockFrom,
    storage: {
        from: jest.fn(() => ({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
            remove: jest.fn()
        }))
    }
}));

const app = require('../app');

describe('API Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Default mocks
        mockSignInWithPassword.mockResolvedValue({ data: { session: { access_token: 'fake-token' }, user: { id: 1 } }, error: null });
        mockSignUp.mockResolvedValue({ data: { user: { id: 1 } }, error: null });
        mockGetUser.mockResolvedValue({ data: { user: { id: 1 } }, error: null });
        
        mockSingle.mockResolvedValue({ data: { id: 1, name: 'Test Single' }, error: null });
        
        // Set up the default .then() resolution for from().select()
        mockFrom.mockImplementation(() => ({
            select: mockSelect,
            eq: mockEq,
            ilike: mockIlike,
            order: mockOrder,
            single: mockSingle,
            insert: mockInsert,
            delete: mockDelete,
            update: mockUpdate,
            in: mockIn,
            then: function(resolve) {
                return Promise.resolve({ data: [{ id: 1, name: 'Test Item' }], error: null }).then(resolve);
            }
        }));
    });

    // --- AUTH ---
    describe('Auth POST /api/auth/login', () => {
        test('sukses', async () => {
            const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'password123' });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Login berhasil');
        });

        test('email salah', async () => {
            mockSignInWithPassword.mockResolvedValueOnce({ data: {}, error: { message: 'Invalid credentials' } });
            const res = await request(app).post('/api/auth/login').send({ email: 'wrong@example.com', password: 'password123' });
            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Email atau password salah');
        });

        test('password salah', async () => {
            mockSignInWithPassword.mockResolvedValueOnce({ data: {}, error: { message: 'Invalid credentials' } });
            const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'wrongpassword' });
            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Email atau password salah');
        });

        test('body kosong (validator gagal)', async () => {
            const res = await request(app).post('/api/auth/login').send({});
            expect(res.status).toBe(400);
        });
    });

    describe('Auth POST /api/auth/register', () => {
        test('sukses', async () => {
            const res = await request(app).post('/api/auth/register')
                .set('Authorization', 'Bearer valid-token')
                .send({ email: 'new@example.com', password: 'password123' });
            expect(res.status).toBe(200);
            expect(res.body.message).toContain('Registrasi berhasil');
        });

        test('validasi gagal (password pendek)', async () => {
            const res = await request(app).post('/api/auth/register')
                .set('Authorization', 'Bearer valid-token')
                .send({ email: 'new@example.com', password: '123' });
            expect(res.status).toBe(400);
        });
    });

    // --- MODULES ---
    describe('Modules GET /api/modules', () => {
        test('GET /api/modules returns list', async () => {
            const res = await request(app).get('/api/modules');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('GET /api/modules/:id returns single module', async () => {
            const res = await request(app).get('/api/modules/1');
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
        });
    });

    describe('Modules POST /api/modules', () => {
        const newModule = { title: 'New Module', description: 'Desc' };
        
        test('tanpa auth harus 401', async () => {
            const res = await request(app).post('/api/modules').send(newModule);
            expect(res.status).toBe(401);
        });

        test('dengan auth harus berhasil (200/201)', async () => {
            const res = await request(app)
                .post('/api/modules')
                .set('Authorization', 'Bearer valid-token')
                .send(newModule);
            expect(res.status).toBe(200); 
            expect(res.body.message).toBe('Module berhasil dibuat');
        });
    });

    // --- MATERIALS ---
    describe('Materials GET /api/materials', () => {
        test('returns list of materials', async () => {
            const res = await request(app).get('/api/materials');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    // --- TOOLS ---
    describe('Tools GET /api/tools', () => {
        test('returns list of tools', async () => {
            const res = await request(app).get('/api/tools');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('search query ?search=', async () => {
            const res = await request(app).get('/api/tools?search=hammer');
            expect(res.status).toBe(200);
            expect(mockIlike).toHaveBeenCalledWith('name', '%hammer%');
        });
    });

    // --- UPLOAD ---
    describe('Upload POST /api/upload-file', () => {
        test('tanpa file harus 400', async () => {
            const res = await request(app)
                .post('/api/upload-file')
                .set('Authorization', 'Bearer valid-token');
            expect(res.status).toBe(400);
            expect(res.body.error).toContain('Tidak ada file');
        });
    });
});
