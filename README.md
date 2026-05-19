# Backend API — PLN Pusdiklat

Layanan REST API untuk pengelolaan modul konstruksi, material jaringan, alat K3, dan autentikasi admin.

> [!CAUTION]
> **STATUS: UNDER DEVELOPMENT** — Project ini masih dalam tahap pengembangan aktif dan belum merupakan versi final.

---

## Tech Stack

- **Runtime**: Node.js + Express.js
- **Database & Storage**: Supabase (PostgreSQL + Storage)
- **Auth**: JWT (jsonwebtoken) + bcrypt
- **Validation**: express-validator

---

## Setup dari Awal

### 1. Prasyarat

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) v18 atau lebih baru
- Akses ke project Supabase yang sudah dikonfigurasi

### 2. Clone & Install

```bash
git clone <url-repo>
cd Backend-Web-PLN
npm install
```

### 3. Konfigurasi `.env`

Salin file contoh:

```bash
cp .env.example .env
```

Isi nilai di `.env`:

| Variabel | Cara mendapatkan |
|---|---|
| `SUPABASE_URL` | Dashboard Supabase → **Integration** → **Data API** → Project URL |
| `SUPABASE_ANON_KEY` | Dashboard Supabase → **Project Settings** → **API Keys** → `anon public` |
| `SUPABASE_SERVICE_KEY` | Dashboard Supabase → **Project Settings** → **API Keys** → `service_role` |
| `JWT_SECRET` | Generate sendiri (lihat langkah di bawah) |
| `PORT` | Biarkan `4000` atau ubah sesuai kebutuhan |
| `ALLOWED_ORIGINS` | URL frontend, contoh: `http://localhost:3000` |

**Generate `JWT_SECRET`:**

```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

Salin output tersebut ke `.env`. Simpan nilai ini di tempat aman bersama tim — jika berbeda antar mesin, semua sesi login yang aktif akan ikut invalid.

### 4. Setup Database (Supabase)

> [!NOTE]
> Lakukan langkah ini hanya jika database Supabase belum pernah diinisialisasi.

1. Buka [Dashboard Supabase](https://app.supabase.com/) → pilih project Anda.
2. Buka menu **SQL Editor** → klik **New Query**.
3. Buka file `migrations/supabase_schema.sql`, salin seluruh isinya, tempel ke editor, lalu klik **Run**.
4. Setelah selesai, jalankan juga file berikut dengan cara yang sama:
   - `migrations/add_mesh_config_table.sql`

File di folder `migrations/` lainnya sudah tercakup di dalam `supabase_schema.sql` dan tidak perlu dijalankan ulang.

### 5. Buat Akun Admin Pertama

Gunakan Postman, Insomnia, atau `curl`:

```
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password_anda"
}
```

Akun ini bisa langsung dipakai untuk login di halaman `/login` pada frontend.

### 6. Jalankan Server

```bash
# Mode pengembangan (auto-restart saat ada perubahan file)
npm run dev

# Mode produksi
npm start
```

Server berjalan di `http://localhost:4000` (atau sesuai nilai `PORT` di `.env`).

---

## Endpoint API

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/register` | — | Daftarkan admin baru |
| POST | `/login` | — | Login, mengembalikan token |
| GET | `/logout` | — | Hapus sesi |
| GET | `/verify` | — | Cek validitas token |

### Modules (`/api/modules`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/modules` | — | List semua modul |
| GET | `/modules/:id` | — | Detail satu modul |
| POST | `/modules` | Ya | Buat modul baru |
| PUT | `/modules/:id` | Ya | Update modul |
| DELETE | `/modules/:id` | Ya | Hapus modul permanen |
| GET | `/modules/:id/mesh-config` | — | Konfigurasi mesh 3D |
| POST | `/modules/:id/mesh-config` | Ya | Simpan konfigurasi mesh |
| GET | `/modules/:id/mapped-meshes` | — | Daftar mesh yang sudah dipetakan |

### Materials & Tools (`/api`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/materials` | — | List material |
| POST | `/materials` | Ya | Tambah material |
| PUT | `/materials/:id` | Ya | Update material |
| DELETE | `/materials/:id` | Ya | Hapus material |
| GET | `/tools` | — | List alat |
| POST | `/tools` | Ya | Tambah alat |
| PUT | `/tools/:id` | Ya | Update alat |
| DELETE | `/tools/:id` | Ya | Hapus alat |

### Relasi & Upload (`/api`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/module-assets` | Ya | Tambah aset 3D ke modul |
| POST | `/module-materials` | Ya | Hubungkan modul dengan material |
| POST | `/module-tools` | Ya | Hubungkan modul dengan alat |
| PATCH | `/module-materials/:id/mesh-name` | Ya | Set nama mesh material |
| PATCH | `/module-tools/:id/mesh-name` | Ya | Set nama mesh alat |
| POST | `/upload-file` | Ya | Upload file GLB/3D |
| POST | `/upload-image` | Ya | Upload gambar |

---

## Struktur Folder

```
Backend-Web-PLN/
├── config/          # Supabase client
├── controllers/     # Logika bisnis per entitas
│   └── helpers/     # Utility storage
├── middleware/      # Auth, validasi request
├── migrations/      # Skema dan migration SQL
├── routes/          # Definisi routing
└── server.js
```

---

Developed for **PLN Pusdiklat**.
