# 📦 [HANDOVER] Backend API - PLN Pusdiklat Internship

Repositori ini adalah bagian dari project magang di PLN Pusdiklat, berisi layanan API untuk pengelolaan data modul pembelajaran, konstruksi, material, dan alat K3.

---

> [!CAUTION]
> **STATUS: UNDER DEVELOPMENT**
> Project ini masih dalam tahap pengembangan aktif dan **belum merupakan versi final**. Beberapa fitur mungkin belum stabil atau masih memerlukan peningkatan.

---

## 🚀 Fitur Utama

- **Authentication**: Integrasi Google Supabase Auth untuk verifikasi admin.
- **Data Management**: CRUD untuk modul konstruksi, material jaringan, dan alat kerja.
- **File Upload**: Handler untuk unggahan file gambar dan model 3D menggunakan Multer.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database & Auth**: Supabase
- **Middleware**: CORS, Body Parser, Multer.

---

## 📤 Instruksi Persiapan (NAS Upload)

1. **Install Dependensi**

   ```bash
   npm install
   ```

2. **Konfigurasi Environment**
   - Salin file `.env.example` menjadi `.env`.
   - Isi variabel dengan kredensial Supabase kantor/internal yang aktif.

   ```bash
   cp .env.example .env
   ```

3. **Inisialisasi Database**
   Eksekusi script SQL di `supabase_schema.sql` pada dashboard database Supabase Anda untuk menyiapkan tabel.

---

## 🚦 Endpoint API

### 🔐 Authentication (`/api/auth`)

| Method   | Endpoint    | Deskripsi                         |
| :------- | :---------- | :-------------------------------- |
| **POST** | `/register` | Registrasi admin baru             |
| **POST** | `/login`    | Login admin (mengembalikan token) |
| **GET**  | `/logout`   | Logout admin                      |
| **GET**  | `/verify`   | Verifikasi validitas token        |

### 📂 Data Modules (`/api/modules`)

| Method     | Endpoint       | Deskripsi                        | Auth |
| :--------- | :------------- | :------------------------------- | :--- |
| **GET**    | `/modules`     | Ambil semua daftar modul         | No   |
| **GET**    | `/modules/:id` | Ambil detail satu modul spesifik | No   |
| **POST**   | `/modules`     | Buat modul baru                  | Yes  |
| **PUT**    | `/modules/:id` | Update data modul                | Yes  |
| **DELETE** | `/modules/:id` | Hapus modul permanen             | Yes  |

### 🛠️ Tools & Materials (`/api`)

| Method     | Endpoint         | Deskripsi                    | Auth |
| :--------- | :--------------- | :--------------------------- | :--- |
| **GET**    | `/tools`         | List semua alat kerja & K3   | No   |
| **GET**    | `/materials`     | List semua material jaringan | No   |
| **POST**   | `/tools`         | Tambah alat baru             | Yes  |
| **POST**   | `/materials`     | Tambah material baru         | Yes  |
| **PUT**    | `/tools/:id`     | Update data alat             | Yes  |
| **PUT**    | `/materials/:id` | Update data material         | Yes  |
| **DELETE** | `/tools/:id`     | Hapus alat                   | Yes  |
| **DELETE** | `/materials/:id` | Hapus material               | Yes  |

### 🔗 Assets & Relations (`/api`)

| Method   | Endpoint            | Deskripsi                       | Auth |
| :------- | :------------------ | :------------------------------ | :--- |
| **POST** | `/module-assets`    | Tambah aset file ke modul       | Yes  |
| **POST** | `/material-assets`  | Tambah aset file ke material    | Yes  |
| **POST** | `/module-materials` | Hubungkan modul dengan material | Yes  |
| **POST** | `/module-tools`     | Hubungkan modul dengan alat     | Yes  |

### 📤 File Uploads (`/api`)

| Method   | Endpoint        | Deskripsi                   | Auth |
| :------- | :-------------- | :-------------------------- | :--- |
| **POST** | `/upload-file`  | Unggah file umum (GLB, dll) | Yes  |
| **POST** | `/upload-image` | Unggah gambar (JPG, PNG)    | Yes  |

---

## 💻 Cara Menjalankan

Lakukan langkah ini di dalam folder `Backend-Intern-PLN`:

1.  **Instalasi Dependensi (Wajib saat pertama kali):**
    ```bash
    npm install
    ```

2.  **Menjalankan Server (Mode Produksi):**
    ```bash
    npm start
    ```

3.  **Menjalankan Mode Pengembangan (Auto-restart):**
    ```bash
    npm run dev
    ```

---

## 📂 Struktur Folder

- `config/`: Konfigurasi Supabase Client.
- `controllers/`: Logika bisnis (Modules, Materials, Tools).
- `routes/`: Definisi routing API.
- `middleware/`: Proteksi rute (Auth) dan storage file.
- `migrations/`: Script SQL untuk skema database.

---

Developed for **PLN Pusdiklat**.
