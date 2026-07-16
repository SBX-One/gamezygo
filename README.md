# Gamezygo Docker Development Setup Guide

This guide explains how to set up Docker for the **Gamezygo E-Commerce** project development according to the specifications in the Product Requirements Document (PRD).

---

## 🏗️ Docker Architecture & PRD Alignment

This Docker setup is designed to match the technology and infrastructure specifications outlined in the PRD:

| Component | PRD Specification | Docker Configuration | Local URL / Port |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js 16 (SPA Pages Router) | Node.js 22 Alpine | `http://localhost:3000` |
| **Backend** | Laravel 13.x | PHP 8.5 FPM Alpine | Accessed via Nginx (`http://localhost:8000`) |
| **Nginx Web Server** | Reverse Proxy | Nginx Alpine (Forwarding port 8000 to PHP-FPM) | `http://localhost:8000` |
| **Database** | PostgreSQL 16.x | `postgres:16-alpine` | `127.0.0.1:5432` |
| **Caching & Queue** | Redis 7.x | `redis:7-alpine` | `127.0.0.1:6379` |

---

## 📁 Docker Folder Structure

Here is the Docker file structure created in your project workspace:

```text
gamezygo/
├── backend/
│   ├── Dockerfile             # PHP 8.5-FPM + Composer + Postgres/Redis Ext configuration
│   └── .env.example           # Backend env template with internal Docker db/redis host
├── frontend/
│   ├── Dockerfile             # Node 22 configuration + Auto-fallback initialization script
│   └── .env.local.example     # Frontend env template for Next.js
├── docker/
│   └── nginx/
│       └── default.conf       # Nginx routing configuration to serve the Laravel API
├── docker-compose.yml         # Orchestration for all containers (Next.js, Laravel, Nginx, Postgres, Redis)
├── setup-project.ps1          # Automated initialization script using Docker (Windows PowerShell)
├── setup-project.sh           # Automated initialization script using Docker (Bash/macOS/Linux)
└── README.md                  # This setup documentation (this file)
```

---

## 🚀 First-Time Setup Steps

To facilitate setup without needing to install PHP, Composer, Node.js, or NPM locally on your operating system, we have provided automated initialization scripts that utilize temporary Docker containers.

### Step 1: Run the Instant Initialization Script

Run the following one-line command in your terminal (in the project directory `C:\laragon\www\gamezygo`):

#### **A. For Windows (PowerShell):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force; .\setup-project.ps1
```

#### **B. For macOS / Linux / WSL / Git Bash:**
```bash
chmod +x setup-project.sh && ./setup-project.sh
```

**What does this script do?**
1. Creates the `backend` and `frontend` folders (if they don't exist).
2. Downloads a temporary Docker Composer image and initializes the **Laravel 13** framework into `./backend`.
3. Downloads a temporary Docker Node image and initializes the **Next.js 16 (Pages Router)** framework with Tailwind CSS & TypeScript into `./frontend`.
4. Creates the `.env` file for the backend and `.env.local` for the frontend based on templates that match the Docker database configuration.

---

### Step 2: Build and Run Docker Containers

After initialization is complete, run all services using Docker Compose:

```bash
docker-compose up -d --build
```

This command will build local Docker images for Next.js and Laravel, and run the PostgreSQL and Redis databases in the background.

---

### Step 3: Initial Laravel Setup (Database Migration)

Once the containers are running, execute the initial Laravel setup commands (such as generating keys and running database migrations) inside the backend container:

1. **Enter the backend container:**
   ```bash
   docker exec -it gamezygo-backend sh
   ```
2. **Run the key generator & migration:**
   ```bash
   php artisan key:generate
   php artisan migrate
   ```
3. **(Optional) Exit the container:**
   ```bash
   exit
   ```

---

## ⚙️ Environment Configuration Details (`.env`)

### Backend (Laravel)
The `backend/.env` file is configured to use internal Docker host services:
- `DB_HOST=postgres` (connects to the database container)
- `REDIS_HOST=redis` (connects to the redis container)

*Note: If you want to run php artisan commands locally directly from your host OS (not from within docker), you need to temporarily change `DB_HOST` and `REDIS_HOST` to `127.0.0.1`.*

### Frontend (Next.js)
The `frontend/.env.local` file is configured to communicate with the backend API:
- `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`

---

## 🛠️ Important Commands During Development

### 1. Stopping All Containers
```bash
docker-compose down
```

### 2. Viewing Container Logs
If an error occurs or you want to monitor Next.js / Laravel logs:
```bash
docker-compose logs -f
# Or logs for a specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

### 3. Running Laravel Queue Worker (Redis)
According to PRD Section 7.1, Redis is used as the queue broker for emails & transactions:
```bash
docker exec -it gamezygo-backend php artisan queue:work
```

### 4. Performing a Hard Database Reset (Postgres)
```bash
docker exec -it gamezygo-backend php artisan migrate:fresh --seed
```

---

## 🔍 Troubleshooting

### 1. Error: `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`
* **Cause:** Docker Desktop on Windows is not running or is booting up.
* **Solution:** Open the **Docker Desktop** application from your Windows Start Menu. Wait until the whale icon in the bottom left corner turns **green** (*Engine Running*). Restart your terminal and try running the command again.

### 2. Next.js or Laravel Not Mounted/Empty After Setup Script
* **Cause 1 (Path Format):** Docker on Windows is sensitive to mixed slashes (`/` vs `\`). The `setup-project.ps1` script has been updated to use the default Windows backslash format (`\`) so volume mounts are mapped correctly.
* **Cause 2 (Folder Conflict):** The presence of empty default folders like `node_modules` in the target directory triggers *no-overwrite* protection (`cp -rn`) when copying framework files from the Docker container.
* **Solution:** Clear the `frontend/` or `backend/` folders of any previous file remnants (except for the `Dockerfile`), then rerun the setup script:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force; .\setup-project.ps1
  ```

### 3. Warning `tempnam(): file created in the system's temporary directory`
* **Cause:** Laravel/Composer lacks write permissions on the `storage` or `bootstrap/cache` folders inside the Docker container.
* **Solution:** Run the following commands in PowerShell at the project root to grant write permissions and set folder ownership to the web server user (`www-data`):
  ```powershell
  docker exec -it gamezygo-backend chmod -R 777 storage bootstrap/cache
  docker exec -it gamezygo-backend chown -R www-data:www-data storage bootstrap/cache
  ```

---

## 👥 Team Collaboration & Git (Push & Clone)

To share this project with your team via Git, follow this guide:

### 📤 Steps for the Developer Pushing (First Time)
Make sure sensitive files (`.env` and `node_modules`/`vendor`) are ignored by Git. Then run the commands:
```bash
git add .
git commit -m "feat: setup docker environment for next.js 16 and laravel 13"
git push origin main
```

### 📥 Steps for Other Team Members (Cloning)
After cloning the project from the Git repository, run the following steps on their respective laptops:

1. **Copy Environment Files:**
   Copy the prepared `.env` templates:
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
   Install Laravel packages via a temporary Composer container (without needing to install PHP/Composer locally):
   * **Windows PowerShell:**
     ```powershell
     docker run --rm -v "${PWD}/backend:/app" -w /app composer install
     ```
   * **Linux / macOS / Git Bash:**
     ```bash
     docker run --rm -v "$(pwd)/backend:/app" -w /app composer install
     ```

3. **Run Docker Compose:**
   Build and run all containers:
   ```bash
   docker-compose up -d --build
   ```
   *(Note: Next.js NPM dependencies will automatically install in the background when the frontend container starts for the first time).*

4. **Run Initial Laravel Setup:**
   Generate a new application key and perform PostgreSQL database migrations:
   ```bash
   docker exec -it gamezygo-backend php artisan key:generate
   docker exec -it gamezygo-backend php artisan migrate
   ```



