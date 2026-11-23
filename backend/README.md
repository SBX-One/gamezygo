# 🎮 Gamezygo Backend — Setup & Development Guide

Dokumentasi resmi untuk instalasi, konfigurasi layanan eksternal (Google OAuth, Midtrans, Brevo, Redis, AWS S3), dan standar pengembangan backend platform **Gamezygo**.

---

## 🛠️ Tech Stack & Environment

| Komponen | Teknologi | Versi | Keterangan |
| :--- | :--- | :--- | :--- |
| **Framework** | Laravel | `13.x` | PHP 8.3+, Eloquent ORM, Sanctum & JWT Auth |
| **Database** | PostgreSQL | `16.x` | JSONB support, strict row constraints, atomic ACID |
| **Cache & Queue** | Redis | `7.x` | Broker queue (transaksional, email) & caching catalog |
| **Payment Gateway** | Midtrans | Snap & Core API | Pembayaran QRIS, Virtual Account, E-Wallet |
| **Authentication** | Google OAuth | `2.0` | Social login via Google Identity Services |
| **Email Service** | Brevo | SMTP Relay | Email invoice & pengiriman kredensial akun game |
| **Cloud Storage** | AWS S3 | latest | Penyimpanan cover game, banner, dan aset media CMS |

---

## 📋 Prasyarat Sistem (Prerequisites)

Sebelum memulai, pastikan server lokal Anda telah memiliki dependensi berikut:
* **PHP >= 8.3** dengan ekstensi aktif:
  * `pdo_pgsql`
  * `redis` (atau package `predis`)
  * `bcmath`, `curl`, `mbstring`, `openssl`, `tokenizer`, `xml`, `zip`
* **Composer >= 2.x**
* **PostgreSQL >= 16**
* **Redis >= 7**
* **Docker Desktop** (Opsional, jika ingin menjalankan PostgreSQL & Redis via container)

---

## 🚀 Panduan Instalasi Cepat (Quick Start)

### 1. Masuk ke Direktori Backend
```bash
cd backend
```

### 2. Salin File Konfigurasi Environment
```bash
cp .env.example .env
```

### 3. Install Dependensi PHP via Composer
```bash
composer install
```

### 4. Generate Application Key & JWT Secret
```bash
php artisan key:generate
php artisan jwt:secret
```

### 5. Jalankan Database Migration & Seeder
Pastikan PostgreSQL sudah aktif dan database (misal `gamezygo`) telah dibuat.
```bash
# Menjalankan migrasi database beserta data awal (seeder admin, kategori, dll)
php artisan migrate:fresh --seed
```

### 6. Hubungkan Symlink Storage Lokal
```bash
php artisan storage:link
```

### 7. Jalankan Server Lokal & Queue Worker
Jalankan di dua jendela terminal terpisah:
```bash
# Terminal 1: Menjalankan Local Web Server (http://127.0.0.1:8000)
php artisan serve --port=8000

# Terminal 2: Menjalankan Background Queue Worker (untuk kirim email & job)
php artisan queue:work
```

---

## ⚙️ Panduan Konfigurasi Layanan Eksternal (.env)

Berikut panduan langkah demi langkah cara mendapatkan kredensial untuk layanan pihak ketiga yang dibutuhkan Gamezygo:

---

### A. 🔑 Konfigurasi Google OAuth 2.0 (Social Login)

Digunakan untuk memvalidasi login Google dari frontend.

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat proyek baru atau pilih proyek yang sudah ada.
3. Masuk ke menu **APIs & Services** $\rightarrow$ **OAuth consent screen**:
   * Pilih tipe **External** lalu klik **Create**.
   * Isi kolom *App name* (misal `Gamezygo`), *User support email*, dan *Developer contact information*.
   * Tambahkan scope `.../auth/userinfo.email` dan `.../auth/userinfo.profile`.
   * Simpan sampai selesai.
4. Masuk ke menu **APIs & Services** $\rightarrow$ **Credentials**:
   * Klik tombol **+ CREATE CREDENTIALS** $\rightarrow$ pilih **OAuth client ID**.
   * Application type: **Web application**.
   * Name: `Gamezygo Web Client`.
   * **Authorized JavaScript origins**:
     * `http://localhost:3000`
     * `http://localhost:8000`
     * `http://127.0.0.1:8000`
   * **Authorized redirect URIs**:
     * `http://localhost:8000/api/v1/auth/google/callback`
     * `http://localhost:3000/auth/callback`
   * Klik **Create**.
5. Salin **Client ID** dan **Client Secret**, lalu masukkan ke [backend/.env](file:///c:/laragon/www/gamezygo/backend/.env):
   ```env
   GOOGLE_CLIENT_ID="ISI_DENGAN_GOOGLE_CLIENT_ID"
   GOOGLE_CLIENT_SECRET="ISI_DENGAN_GOOGLE_CLIENT_SECRET"
   GOOGLE_REDIRECT_URI="http://localhost:8000/api/v1/auth/google/callback"
   ```

---

### B. 💳 Konfigurasi Midtrans Payment Gateway (Sandbox)

Digunakan untuk memproses pembayaran rupiah otomatis (QRIS, VA, E-Wallet) dan webhook fulfillment.

1. Daftar dan login ke [Dashboard Midtrans Sandbox](https://dashboard.sandbox.midtrans.com/).
2. Di pojok kiri atas, pastikan label bertuliskan **SANDBOX** (bukan Production).
3. Masuk ke menu **Settings** $\rightarrow$ **Access Keys**:
   * Salin **Server Key** dan **Client Key**.
4. Masuk ke menu **Settings** $\rightarrow$ **Configuration**:
   * Pada kolom **Payment Notification URL**, masukkan URL webhook backend:
     ```text
     https://api.domain-anda.com/api/v1/payments/webhook
     ```
     *(Untuk pengujian lokal, Anda dapat menggunakan tunneling seperti Ngrok atau Expose)*.
5. Masukkan ke file [backend/.env](file:///c:/laragon/www/gamezygo/backend/.env):
   ```env
   MIDTRANS_SERVER_KEY="Mid-server-YOUR_SERVER_KEY"
   MIDTRANS_CLIENT_KEY="Mid-client-YOUR_CLIENT_KEY"
   MIDTRANS_IS_PRODUCTION=false
   ```

---

### C. 📧 Konfigurasi Email Brevo (SMTP Relay)

Digunakan untuk pengiriman invoice dan kredensial akun game ke email pengguna.

1. Daftar dan login ke [Brevo](https://app.brevo.com/).
2. **Kredensial SMTP:**
   * Klik nama profil Anda di pojok kanan atas $\rightarrow$ pilih **SMTP & API**.
   * Buka tab **SMTP**.
   * Catat **Login / Username** yang tertera di sana (contoh: `b9cc50001@smtp-brevo.com` atau email akun Anda).
   * Klik tombol **Generate a new SMTP key** $\rightarrow$ beri nama (misal `Gamezygo Local`) $\rightarrow$ salin kunci yang muncul (panjang ~70 karakter diawali `xsmtpsib-`).
3. **Pengaturan IP Keamanan (Agar tidak terblokir `525 Unauthorized IP`):**
   * Masuk ke **Settings** $\rightarrow$ **Security** $\rightarrow$ tab **Authorized IPs**.
   * Pada bagian **Blocking unauthorized IP addresses**, klik **Deactivate** (nonaktifkan untuk pengujian lokal) ATAU tambahkan IP publik Anda dan klik link validasi di inbox email Anda.
4. **Verifikasi Alamat Pengirim (*Sender*):**
   * Masuk ke menu **Senders, Domains & Dedicated IPs** $\rightarrow$ tab **Senders**.
   * Klik **Add a sender** dan daftarkan email pengirim (misal email Anda yang terverifikasi).
5. Masukkan ke file [backend/.env](file:///c:/laragon/www/gamezygo/backend/.env):
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp-relay.brevo.com
   MAIL_PORT=587
   MAIL_USERNAME="b9cc50001@smtp-brevo.com"
   MAIL_PASSWORD="xsmtpsib-YOUR_SMTP_KEY"
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS="email-anda-yang-sudah-verified@gmail.com"
   MAIL_FROM_NAME="Gamezygo"
   ```

---

### D. ⚡ Konfigurasi Redis (Cache & Queue)

Digunakan untuk caching respon katalog (Guest side) dan queue pengiriman email secara asinkron.

1. Jalankan server Redis lokal di port `6379`, atau gunakan Docker:
   ```bash
   docker-compose up -d redis
   ```
2. Pastikan konfigurasi di [backend/.env](file:///c:/laragon/www/gamezygo/backend/.env) sudah sesuai:
   ```env
   CACHE_STORE=redis
   QUEUE_CONNECTION=redis

   REDIS_CLIENT=phpredis
   REDIS_HOST=127.0.0.1
   REDIS_PASSWORD=null
   REDIS_PORT=6379
   ```

---

### E. 📦 Konfigurasi AWS S3 (Cloud Storage)

Digunakan untuk penyimpanan cloud gambar cover game, banner pengumuman, dan komunitas.

1. Buka [AWS Management Console](https://console.aws.amazon.com/) dan buat **S3 Bucket** baru.
2. Buat **IAM User** dengan *Programmatic access* dan lampirkan policy `AmazonS3FullAccess`.
3. Masukkan ke file [backend/.env](file:///c:/laragon/www/gamezygo/backend/.env):
   ```env
   FILESYSTEM_DISK=s3
   AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
   AWS_DEFAULT_REGION=ap-southeast-1
   AWS_BUCKET=gamezygo-bucket
   AWS_URL=https://gamezygo-bucket.s3.ap-southeast-1.amazonaws.com
   ```
   *(Catatan: Jika kredensial S3 dikosongkan pada environment lokal, sistem otomatis fallback ke local `public` storage disk secara aman)*.

---

## 🛠️ Perintah-Perintah Artisan Kustom Gamezygo

Platform Gamezygo dilengkapi command Artisan internal:

```bash
# 1. Bersihkan seluruh Redis cache Gamezygo
php artisan gamezygo:cache-clear

# Bersihkan cache berdasarkan tag tertentu (products, faqs, announcements, communities, blogs)
php artisan gamezygo:cache-clear products
php artisan gamezygo:cache-clear communities

# 2. Lepaskan reservasi kredensial game yang kedaluwarsa (otomatis mengembalikan stok)
php artisan gamezygo:release-expired-reservations

# 3. Sinkronisasi aset media lokal (covers, banners) ke AWS S3 bucket
php artisan gamezygo:s3-sync --all
php artisan gamezygo:s3-sync --all --dry-run
php artisan gamezygo:s3-sync --all --db-update
```

---

## 🧪 Menjalankan Automated Test Suite (Pengujian)

Seluruh logika bisnis dilindungi oleh pengujian fitur otomatis (PHPUnit):

```bash
# Menjalankan seluruh test suite
php artisan test

# Menjalankan test Data Isolation Shield & Credential Allocation
php artisan test tests/Feature/Library/CredentialAllocationAndIsolationTest.php

# Menjalankan test Email Dispatcher & S3 Sync
php artisan test tests/Feature/Integration/EmailDispatcherAndS3SyncTest.php

# Menjalankan test Redis Caching
php artisan test tests/Feature/Cache/RedisCachingTest.php
```

---

## 🔒 Standar Keamanan & Coding Guidelines (Aturan Pengembang)

Sesuai dokumen arsitektur [GEMINI.md](file:///c:/laragon/www/gamezygo/GEMINI.md):
1. **Format Kode:** Menggunakan indentasi **2 spasi** (bukan 4 spasi atau tab).
2. **Kurung Kurawal (Braces):**
   * Deklarasi Class & Method: Kurung kurawal pembuka `{` diletakkan di **baris baru**.
   * Struktur Kontrol (`if`, `foreach`, `while`): Kurung kurawal pembuka `{` diletakkan di **baris yang sama**.
3. **Data Isolation Shield:** Semua endpoint kredensial (`/library`, `/credentials`) **WAJIB** terikat pada `auth()->id()` dan didekripsi *on-the-fly*. Tidak boleh membocorkan kredensial antar akun pengguna.
4. **Anti-Double Allocation:** Pengalokasian stok akun game menggunakan database locking `lockForUpdate()` di dalam `DB::transaction()` untuk mencegah penjualan ganda pada pesanan konkuren.
