# Installation Guide

Detailed installation instructions for LegumeSec.

## System Requirements

### Minimum Requirements
- **OS:** Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **Python:** 3.9 or higher
- **Node.js:** 18.0 or higher
- **PostgreSQL:** 12.0 or higher
- **RAM:** 4GB minimum (8GB recommended)
- **Disk Space:** 2GB free space

### Recommended Requirements
- **Python:** 3.11+
- **Node.js:** 20.0+
- **PostgreSQL:** 14.0+
- **RAM:** 8GB+
- **Disk Space:** 5GB+

## Step-by-Step Installation

### 1. Install Python

#### Windows
1. Download Python from [python.org](https://www.python.org/downloads/)
2. Run installer, check "Add Python to PATH"
3. Verify: `python --version`

#### macOS
```bash
# Using Homebrew
brew install python@3.11

# Verify
python3 --version
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip
python3 --version
```

### 2. Install Node.js

#### Windows/macOS
1. Download from [nodejs.org](https://nodejs.org/)
2. Run installer
3. Verify: `node --version` and `npm --version`

#### Linux
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Install PostgreSQL

#### Windows
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer, remember the postgres user password
3. Add PostgreSQL bin to PATH

#### macOS
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Linux
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 4. Clone Repository

```bash
git clone https://github.com/yourusername/LegumeSec.git
cd LegumeSec
```

### 5. Backend Installation

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

### 6. Database Setup

```bash
# Create database
createdb legumsec_db

# Or using PostgreSQL command line
psql -U postgres
CREATE DATABASE legumsec_db;
\q
```

### 7. Backend Configuration

```bash
# Copy environment template
cp env.example .env

# Edit .env file (see Environment Variables guide)
# Set these required variables:
# - SECRET_KEY
# - DB_NAME=legumsec_db
# - DB_USER=postgres
# - DB_PASSWORD=your_password
# - DB_HOST=localhost
# - DB_PORT=5432
```

### 8. Run Migrations

```bash
python manage.py migrate
```

### 9. Create Superuser

```bash
python manage.py createsuperuser
# Follow prompts to create admin user
```

### 10. Frontend Installation

```bash
cd ../frontend

# Install dependencies
npm install

# Or using yarn
yarn install
```

### 11. Frontend Configuration

```bash
# Create .env file if needed
# Set VITE_API_URL=http://localhost:8000
```

### 12. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

## Verification

### Backend Check
- Visit: http://localhost:8000/api/
- Should see API root or welcome message
- Admin: http://localhost:8000/admin/

### Frontend Check
- Visit: http://localhost:5173
- Should see login page
- Login with superuser credentials

## Production Installation

For production deployment, see [Deployment Guide](./operations/deployment.md).

## Troubleshooting

### Python Issues
- **Module not found:** Ensure virtual environment is activated
- **Permission denied:** Use `python -m pip install` instead of `pip install`

### Node.js Issues
- **npm errors:** Clear cache: `npm cache clean --force`
- **Version conflicts:** Use `nvm` (Node Version Manager)

### PostgreSQL Issues
- **Connection refused:** Check if PostgreSQL service is running
- **Authentication failed:** Verify credentials in `.env`

### Port Already in Use
- **Backend (8000):** Change port: `python manage.py runserver 8001`
- **Frontend (5173):** Change in `vite.config.js`

## Next Steps

- ✅ [Configuration Guide](./configuration.md)
- ✅ [Development Guide](./operations/development.md)
- ✅ [API Documentation](./backend/api-reference.md)

---

**Installation complete?** Continue to [Configuration Guide](./configuration.md).









