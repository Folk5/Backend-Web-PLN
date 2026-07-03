# Backend Web PLN

Ini adalah repositori backend untuk project aplikasi Web PLN. Aplikasi ini dibangun menggunakan Express.js, Prisma ORM, dan PostgreSQL.

## Persyaratan Sistem (Prerequisites)

Sebelum mulai menjalankan proyek ini, pastikan Anda telah menginstal software berikut di komputer Anda:

1. **Node.js** (Sangat disarankan menggunakan **Versi 20.x atau lebih baru**)
   - Anda dapat mengunduh versi terbaru Node.js dari [nodejs.org](https://nodejs.org/).
   - Untuk memverifikasi versi instalasi, buka terminal dan jalankan: `node -v`
2. **PostgreSQL**
   - Instal PostgreSQL dari [postgresql.org](https://www.postgresql.org/download/).
   - Pastikan service PostgreSQL sudah berjalan (*running*).
   - Buat sebuah database baru yang kosong (contoh nama: `pln_db`) menggunakan pgAdmin, DBeaver, atau Command Line.
3. **Git**
   - Untuk mengunduh (clone) repositori ke komputer lokal.

## Panduan Instalasi dan Menjalankan Proyek

### 1. Clone Repositori

Buka terminal (Command Prompt / PowerShell / Git Bash) dan jalankan perintah berikut untuk mengunduh kode backend:

```bash
git clone <URL_REPO_BACKEND_INI>
cd Backend-Web-PLN
```

### 2. Instalasi Dependensi (Package)

Jalankan perintah berikut untuk menginstal seluruh *package* NPM yang dibutuhkan:

```bash
npm install
```

### 3. Konfigurasi Environment Variables

1. Buat sebuah file baru bernama `.env` (tanpa ekstensi apapun di belakangnya) di folder utama (root) `Backend-Web-PLN`.
2. Isi file `.env` tersebut dengan konfigurasi koneksi ke database Anda. Berikut adalah contohnya:

```env
# Sesuaikan 'postgres' dengan username postgres Anda, 'password123' dengan password postgres Anda, dan 'pln_db' dengan nama database yang Anda buat sebelumnya.
DATABASE_URL="postgresql://postgres:password123@localhost:5432/pln_db?schema=public"
PORT=3000
```

### 4. Setup Database

Terdapat dua skenario untuk melakukan inisialisasi database:

**Skenario A: Inisialisasi Database Kosong (Hanya membuat struktur/schema tabel)**
Jika Anda hanya ingin aplikasi bisa dijalankan tanpa peduli isinya kosong:
```bash
npx prisma db push
```

**Skenario B: Menggunakan Data yang Sudah Ada (Backup / Restore)**
Jika Anda ingin melanjutkan dari database yang sudah berisi data dummy, akun, atau transaksi dari *developer* sebelumnya:
1. Minta file backup database (contohnya `backup.sql`) dari rekan tim Anda.
2. Lakukan *Restore/Import* file tersebut ke database PostgreSQL Anda menggunakan aplikasi seperti pgAdmin atau DBeaver.
3. Setelah restore selesai dan berhasil, jalankan perintah ini agar Prisma client mengenali struktur terbaru:
```bash
npx prisma generate
```

### 5. Menjalankan Server

Setelah semua tahapan di atas berhasil diselesaikan, Anda dapat menjalankan server backend di mode *development* (otomatis me-restart server ketika ada perubahan kode) menggunakan perintah:

```bash
npm run dev
```

Jika sukses, terminal akan menampilkan log bahwa server sedang berjalan. Pastikan server dibiarkan terbuka selama Anda ingin mengakses aplikasinya.
