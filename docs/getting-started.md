# Quick Start Guide

Get LegumeSec up and running in minutes.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **PostgreSQL 12+** - [Download PostgreSQL](https://www.postgresql.org/download/)
- **Git** - [Download Git](https://git-scm.com/downloads)

## Quick Start (5 minutes)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp env.example .env

# Edit .env file with your database credentials
# See Configuration Guide for details

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

Backend will be running at `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Copy environment file (if needed)
cp .env.example .env

# Start development server
npm run dev
```

Frontend will be running at `http://localhost:5173`

### 4. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api/
- **Admin Panel:** http://localhost:8000/admin/

## First Steps

1. **Login** - Use the superuser credentials you created
2. **Explore Dashboard** - View the main dashboard
3. **Create Data** - Add your first agriculteur, exploitation, or parcelle
4. **Review API** - Check the API documentation at `/api/`

## Next Steps

- 📖 Read the [Installation Guide](./installation.md) for detailed setup
- 🔧 Configure [Environment Variables](./configuration.md)
- 📚 Explore [API Documentation](./backend/api-reference.md)
- 🎨 Learn about [Components](./frontend/components.md)

## Common Issues

### Backend won't start
- Check if PostgreSQL is running
- Verify database credentials in `.env`
- Ensure all migrations are applied: `python manage.py migrate`

### Frontend won't start
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

### Database connection errors
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `createdb legumsec_db`

## Need Help?

- Review [Configuration Guide](./configuration.md) for environment setup
- Check [Deployment Guide](./operations/deployment.md) for production setup
- See [API Reference](./backend/api-reference.md) for endpoint documentation

---

**Ready for more?** Continue to [Installation Guide](./installation.md) for detailed setup instructions.















