# LegumeSec Documentation

Technical documentation for the LegumeSec agricultural data management platform.

## Getting started

- [Installation](installation.md) — system requirements and setup
- [Quick start](getting-started.md) — condensed setup guide
- [Configuration](configuration.md) — environment variables and database
- [Architecture](architecture.md) — system design and technology choices
- [Fixes implemented](FIXES_IMPLEMENTED.md) — notable improvements and bug fixes

## Backend

- [API reference](backend/api-reference.md)
- [Authentication & authorization](backend/authentication.md)
- [Validation & security](backend/validation-security.md)

## Frontend

- [Service layer](frontend/service-layer.md)
- [Components](frontend/components.md)

## Operations

- [Deployment](operations/deployment.md)

## Data setup

Location reference data (wilayas, subdivisions, communes) is seeded via:

```bash
python manage.py import_data
```

Optional SQL seed scripts for dashboard demo data are in `backend/` (`seed_top_wilaya_data.sql`, etc.).
