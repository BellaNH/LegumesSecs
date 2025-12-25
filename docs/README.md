# LegumeSec Documentation

Comprehensive technical documentation for the LegumeSec agricultural data management system - an official MVP developed for the Ministry of Agriculture.

## 📋 About This Project

LegumeSec is a full-stack web application designed to manage complex, hierarchical agricultural datasets. The system replaces error-prone Excel spreadsheet workflows with a centralized, scalable solution featuring role-based access control, location-based filtering, and real-time analytics.

**Project Type:** Official MVP  


## 📚 Documentation Structure

### Getting Started
- [Quick Start Guide](./getting-started.md) - Get up and running quickly
- [Installation Guide](./installation.md) - Detailed installation instructions
- [Configuration Guide](./configuration.md) - Environment setup and configuration

### Architecture & Design
- [System Architecture](./architecture.md) - Overview of the system design and technology stack

### Backend Documentation
- [API Reference](./backend/api-reference.md) - Complete API endpoint documentation
- [Authentication & Authorization](./backend/authentication.md) - JWT authentication, roles, and permissions
- [Validation & Security](./backend/validation-security.md) - Input validation and security measures

### Frontend Documentation
- [Service Layer](./frontend/service-layer.md) - API client architecture and service methods
- [Components](./frontend/components.md) - Reusable React components and patterns

### Operations
- [Deployment Guide](./operations/deployment.md) - Production deployment instructions

## 🚀 Quick Links

- **New to the project?** Start with the [Quick Start Guide](./getting-started.md)
- **Setting up locally?** See [Installation Guide](./installation.md)
- **Deploying to production?** Check [Deployment Guide](./operations/deployment.md)
- **Using the API?** Read [API Reference](./backend/api-reference.md)
- **Building components?** See [Components Guide](./frontend/components.md)

## 🛠️ Technology Stack

### Frontend
- React 18.3 with Context API for state management
- Material-UI 7.0 for UI components
- Tailwind CSS 3.4 for styling
- Recharts 2.15 for data visualization
- Vite 6.2 for build tooling

### Backend
- Django 4.2+ with Django REST Framework
- PostgreSQL 12+ for data persistence
- JWT authentication (djangorestframework-simplejwt)
- Modular settings architecture (development/production)

## 📖 Documentation Standards

This documentation follows these principles:
- **Clear and concise** - Easy to understand for developers and stakeholders
- **Example-driven** - Code examples for every concept
- **Task-oriented** - Focused on getting things done
- **Well-organized** - Logical structure and navigation
- **Up-to-date** - Maintained with the codebase

## 🔍 Finding Information

- Browse the documentation sections above
- Use your editor's search functionality (Ctrl/Cmd + F) to find specific topics
- Check the [Configuration Guide](./configuration.md) for environment setup
- Review [Deployment Guide](./operations/deployment.md) for production setup

---

**Last Updated:** 2024  
**Current Version:** 1.0.0  
**Project Status:** Production MVP
