# Gamezygo Docker Development Setup Guide

Panduan ini menjelaskan cara melakukan setup Docker untuk pengembangan proyek **Gamezygo E-Commerce** sesuai dengan spesifikasi pada Product Requirements Document (PRD).

---

## 🏗️ Arsitektur Docker & Kecocokan PRD

Setup Docker ini dirancang agar sesuai dengan spesifikasi teknologi dan infrastruktur yang tertulis pada PRD:

| Komponen | Spesifikasi PRD | Konfigurasi Docker | URL / Port Lokal |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js 16 (SPA Pages Router) | Node.js 22 Alpine | `http://localhost:3000` |
| **Backend** | Laravel 13.x | PHP 8.5 FPM Alpine | Diakses via Nginx (`http://localhost:8000`) |
| **Nginx Web Server** | Reverse Proxy | Nginx Alpine (Forwarding port 8000 ke PHP-FPM) | `http://localhost:8000` |
| **Database** | PostgreSQL 16.x | `postgres:16-alpine` | `127.0.0.1:5432` |
| **Caching & Queue** | Redis 7.x | `redis:7-alpine` | `127.0.0.1:6379` |

---

## 📁 Struktur Folder Docker

Berikut adalah struktur file Docker yang telah dibuat di workspace proyek Anda:

```text
gamezygo/
├── backend/
│   ├── Dockerfile             # Konfigurasi PHP 8.5-FPM + Composer + Ext Postgres/Redis
│   └── .env.example           # Template env backend dengan host db/redis internal Docker
├── frontend/
│   ├── Dockerfile             # Konfigurasi Node 22 + Script auto-fallback initialization
│   └── .env.local.example     # Template env frontend untuk Next.js
├── docker/
│   └── nginx/
│       └── default.conf       # Konfigurasi routing Nginx untuk melayani Laravel API
├── docker-compose.yml         # Orkestrasi seluruh container (Next.js, Laravel, Nginx, Postgres, Redis)
├── setup-project.ps1          # Script inisialisasi otomatis menggunakan Docker (Windows PowerShell)
├── setup-project.sh           # Script inisialisasi otomatis menggunakan Docker (Bash/macOS/Linux)
└── README.md                  # Dokumentasi setup ini (file ini)
```

---

## 🚀 Langkah-Langkah Setup Pertama Kali

Untuk memudahkan setup tanpa perlu menginstal PHP, Composer, Node.js, atau NPM secara lokal di sistem operasi Anda, kami telah menyediakan script inisialisasi otomatis yang memanfaatkan container Docker sementara.

### Langkah 1: Jalankan Script Inisialisasi Instan

Jalankan perintah satu baris berikut di terminal Anda (pada direktori proyek `C:\laragon\www\gamezygo`):

#### **A. Untuk Windows (PowerShell):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force; .\setup-project.ps1
```

#### **B. Untuk macOS / Linux / WSL / Git Bash:**
```bash
chmod +x setup-project.sh && ./setup-project.sh
```

**Apa yang dilakukan script ini?**
1. Membuat folder `backend` dan `frontend` (jika belum ada).
2. Men-download image Docker Composer sementara dan menginisialisasi framework **Laravel 13** ke dalam `./backend`.
3. Men-download image Docker Node sementara dan menginisialisasi framework **Next.js 16 (Pages Router)** dengan Tailwind CSS & TypeScript ke dalam `./frontend`.
4. Membuat file `.env` untuk backend dan `.env.local` untuk frontend berdasarkan template yang sesuai dengan konfigurasi database Docker.

---

### Langkah 2: Build dan Jalankan Container Docker

Setelah inisialisasi selesai, jalankan seluruh service menggunakan Docker Compose:

```bash
docker-compose up -d --build
```

Perintah ini akan membangun image Docker lokal untuk Next.js dan Laravel, serta menjalankan database PostgreSQL dan Redis di latar belakang.

---

### Langkah 3: Setup Awal Laravel (Migrasi Database)

Setelah container menyala, jalankan perintah setup awal Laravel (seperti generating key dan menjalankan migrasi database) di dalam container backend:

1. **Masuk ke container backend:**
   ```bash
   docker exec -it gamezygo-backend sh
   ```
2. **Jalankan key generator & migrasi:**
   ```bash
   php artisan key:generate
   php artisan migrate
   ```
3. **(Opsional) Keluar dari container:**
   ```bash
   exit
   ```

---

## ⚙️ Detail Konfigurasi Environment (`.env`)

### Backend (Laravel)
File `backend/.env` diatur untuk menggunakan service host internal Docker:
- `DB_HOST=postgres` (menghubungkan ke container database)
- `REDIS_HOST=redis` (menghubungkan ke container redis)

*Catatan: Jika Anda ingin menjalankan perintah php artisan secara lokal langsung dari host OS Anda (tidak dari dalam docker), Anda perlu mengubah `DB_HOST` dan `REDIS_HOST` menjadi `127.0.0.1` sementara.*

### Frontend (Next.js)
File `frontend/.env.local` dikonfigurasi untuk berkomunikasi dengan API backend:
- `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`

---

## 🛠️ Perintah-Perintah Penting Selama Development

### 1. Menghentikan Semua Container
```bash
docker-compose down
```

### 2. Melihat Log Container
Jika terjadi error atau ingin memantau log Next.js / Laravel:
```bash
docker-compose logs -f
# Atau log untuk service tertentu
docker-compose logs -f frontend
docker-compose logs -f backend
```

### 3. Menjalankan Queue Worker Laravel (Redis)
Sesuai dengan PRD Section 7.1, Redis digunakan sebagai queue broker untuk email & transaksi:
```bash
docker exec -it gamezygo-backend php artisan queue:work
```

### 4. Melakukan Hard Reset Database (Postgres)
```bash
docker exec -it gamezygo-backend php artisan migrate:fresh --seed
```

---

## 🔍 Troubleshooting (Penanganan Masalah)

### 1. Error: `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`
* **Penyebab:** Docker Desktop di Windows belum berjalan atau sedang proses booting.
* **Solusi:** Buka aplikasi **Docker Desktop** dari Start Menu Windows Anda. Tunggu sampai ikon paus di pojok kiri bawah berwarna **hijau** (*Engine Running*). Restart terminal Anda dan coba jalankan kembali perintah.

### 2. Next.js atau Laravel Tidak Ter-mount/Kosong Setelah Script Setup
* **Penyebab 1 (Format Path):** Docker Windows sensitif terhadap campuran garis miring (`/` vs `\`). Script `setup-project.ps1` sekarang sudah diperbaiki untuk menggunakan format backslash (`\`) default Windows agar volume mount terpetakan dengan benar.
* **Penyebab 2 (Folder Konflik):** Adanya folder bawaan kosong seperti `node_modules` di direktori target yang memicu proteksi *no-overwrite* (`cp -rn`) saat menyalin file framework dari Docker container.
* **Solusi:** Kosongkan folder `frontend/` atau `backend/` dari sisa-sisa file sebelumnya (kecuali berkas `Dockerfile`), lalu jalankan kembali script setup:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force; .\setup-project.ps1
  ```

### 3. Peringatan `tempnam(): file created in the system's temporary directory`
* **Penyebab:** Laravel/Composer tidak memiliki hak akses tulis (*write permission*) pada folder `storage` atau `bootstrap/cache` di dalam kontainer Docker.
* **Solusi:** Jalankan perintah berikut di PowerShell root proyek untuk memberikan izin tulis dan mengatur kepemilikan folder ke user web server (`www-data`):
  ```powershell
  docker exec -it gamezygo-backend chmod -R 777 storage bootstrap/cache
  docker exec -it gamezygo-backend chown -R www-data:www-data storage bootstrap/cache
  ```

---

## 👥 Kolaborasi Tim & Git (Push & Clone)

Untuk berbagi proyek ini dengan tim Anda melalui Git, ikuti panduan berikut:

### 📤 Langkah untuk Pengembang yang Melakukan Push (Pertama Kali)
Pastikan berkas sensitif (`.env` dan `node_modules`/`vendor`) diabaikan oleh Git. Kemudian jalankan perintah:
```bash
git add .
git commit -m "feat: setup docker environment for next.js 16 and laravel 13"
git push origin main
```

### 📥 Langkah untuk Anggota Tim Lain (Melakukan Clone)
Setelah melakukan clone proyek dari repositori Git, jalankan langkah berikut di laptop masing-masing:

1. **Copy File Environment:**
   Salin template `.env` yang sudah disiapkan:
   * **Windows PowerShell:**
     ```powershell
     copy backend/.env.example backend/.env
     copy frontend/.env.local.example frontend/.env.local
     ```
   * **Linux / macOS / Git Bash:**
     ```bash
     cp backend/.env.example backend/.env
     cp frontend/.env.local.example frontend/.env.local
     ```

2. **Install Composer Dependencies:**
   Instal paket-paket Laravel lewat kontainer Composer sementara (tanpa perlu menginstal PHP/Composer secara lokal):
   * **Windows PowerShell:**
     ```powershell
     docker run --rm -v "${PWD}/backend:/app" -w /app composer install
     ```
   * **Linux / macOS / Git Bash:**
     ```bash
     docker run --rm -v "$(pwd)/backend:/app" -w /app composer install
     ```

3. **Jalankan Docker Compose:**
   Bangun dan jalankan seluruh container:
   ```bash
   docker-compose up -d --build
   ```
   *(Catatan: NPM dependencies Next.js akan otomatis terinstal di latar belakang ketika kontainer frontend menyala pertama kali).*

4. **Jalankan Setup Awal Laravel:**
   Generate key aplikasi baru dan lakukan migrasi database PostgreSQL:
   ```bash
   docker exec -it gamezygo-backend php artisan key:generate
   docker exec -it gamezygo-backend php artisan migrate
   ```



