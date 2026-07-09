# LegumeSec

Full-stack agricultural data management platform built as an MVP for legume crop tracking across Algeria's administrative hierarchy (wilaya → subdivision → commune).

LegumeSec replaces spreadsheet-based workflows with a centralized web app: role-based access, location-scoped data, production objectives, and analytics dashboards for field teams and administrators.

## Highlights

- **React + Vite** frontend with Material UI, Tailwind, and Recharts
- **Django REST Framework** API with JWT authentication and granular permissions
- **PostgreSQL** data model for farmers, farms, parcels, crops, and production targets
- **Dashboard analytics** — species surface comparison, yearly production, top wilayas, forecast vs actual
- **Deployed** frontend on Netlify, backend on Render, database on Supabase

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 18, Vite, MUI, Tailwind CSS, Recharts, Axios |
| Backend | Django 4.2+, DRF, SimpleJWT, PostgreSQL |
| Auth | JWT access/refresh tokens, role + permission model |
| CI/CD | GitHub Actions → Netlify + Render |

## Quick start

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 12+

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env         # then edit values
python manage.py migrate
python manage.py import_data # seed wilayas, subdivisions, communes
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173` — API defaults to `http://127.0.0.1:8000`.

## Documentation

| Topic | Location |
|-------|----------|
| Installation | [docs/installation.md](docs/installation.md) |
| Configuration | [docs/configuration.md](docs/configuration.md) |
| Architecture | [docs/architecture.md](docs/architecture.md) |
| Fixes & improvements log | [docs/FIXES_IMPLEMENTED.md](docs/FIXES_IMPLEMENTED.md) |
| API reference | [docs/backend/api-reference.md](docs/backend/api-reference.md) |
| Deployment | [docs/operations/deployment.md](docs/operations/deployment.md) |

## Project structure

```
LegumeSec/
├── frontend/          # React SPA (pages, components, services)
├── backend/           # Django API (models, views, services)
├── docs/              # Technical documentation
└── .github/workflows/ # CI/CD pipeline
```

## License

Private portfolio project — contact the author for usage terms.
