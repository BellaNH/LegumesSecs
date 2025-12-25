# System Architecture

Overview of LegumeSec system architecture and design decisions.

## High-Level Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   React SPA     │────────▶│  Django REST    │
│   (Frontend)     │  HTTP   │  Framework API  │
│                 │         │   (Backend)      │
└─────────────────┘         └────────┬────────┘
                                      │
                                      ▼
                              ┌─────────────────┐
                              │   PostgreSQL    │
                              │    Database     │
                              └─────────────────┘
```

## Technology Stack

### Frontend
- **Framework:** React 18.3
- **Build Tool:** Vite 6.2
- **UI Library:** Material-UI 7.0
- **Styling:** Tailwind CSS 3.4
- **Routing:** React Router DOM 7.5
- **HTTP Client:** Axios 1.8
- **State Management:** React Context API
- **Charts:** Recharts 2.15

### Backend
- **Framework:** Django 4.2+
- **API Framework:** Django REST Framework
- **Database:** PostgreSQL 12+
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Rate Limiting:** django-ratelimit
- **Soft Delete:** django-safedelete
- **CORS:** django-cors-headers

## Architecture Principles

### Separation of Concerns
- **Frontend:** Presentation and user interaction
- **Backend:** Business logic and data management
- **Database:** Data persistence

### API-First Design
- RESTful API architecture
- JSON-based communication
- Stateless authentication (JWT)

### Security First
- Environment-based configuration
- Input validation and sanitization
- Role-based access control
- Rate limiting
- Security headers

## Frontend Architecture

### Component Structure
```
frontend/src/
├── components/          # Reusable components
│   ├── common/         # Shared components
│   └── Sidebar.jsx     # Navigation
├── contexts/           # React contexts
│   ├── AuthContext.jsx
│   ├── DataContext.jsx
│   └── UIContext.jsx
├── hooks/              # Custom hooks
├── Pages/              # Page components
├── services/            # API services
│   └── api/            # API client and services
└── utils/              # Utility functions
```

### State Management
- **Global State:** Context API (Auth, Data, UI)
- **Local State:** useState for component-specific state
- **Server State:** API services with caching

### Data Flow
```
User Action → Component → Service → API Client → Backend API → Database
                ↓
            Update Context → Re-render Components
```

## Backend Architecture

### Project Structure
```
backend/
├── api/                # Main application
│   ├── models.py      # Database models
│   ├── serializers.py # DRF serializers
│   ├── views.py       # API views
│   ├── services/      # Business logic layer
│   ├── exceptions.py  # Custom exceptions
│   └── middleware.py  # Custom middleware
├── crud/              # Django project
│   └── settings/      # Settings modules
│       ├── base.py
│       ├── development.py
│       └── production.py
└── manage.py
```

### Layered Architecture
1. **Views Layer** - HTTP request/response handling
2. **Services Layer** - Business logic
3. **Models Layer** - Data access
4. **Database Layer** - PostgreSQL

### Request Flow
```
HTTP Request → Middleware → URL Router → View → Service → Model → Database
                ↓
            Response ← Serializer ← View ← Service ← Model
```

## Authentication & Authorization

### Authentication Flow
1. User submits credentials
2. Backend validates and issues JWT tokens
3. Frontend stores tokens in localStorage
4. API client adds token to requests
5. Backend validates token on each request

### Authorization
- **Role-Based Access Control (RBAC)**
- **Model-Level Permissions**
- **User Scope Filtering** (Wilaya/Subdivision)

## Data Model

### Core Entities
- **User** - System users with roles
- **Wilaya** - Administrative regions
- **SubDivision** - Sub-regions
- **Commune** - Municipalities
- **Agriculteur** - Farmers
- **Exploitation** - Agricultural exploitations
- **Parcelle** - Land parcels
- **Espece** - Crop species
- **Objectif** - Production objectives

### Relationships
```
Wilaya → SubDivision → Commune → Exploitation → Parcelle
                              ↑
                         Agriculteur
```

## Security Architecture

### Security Layers
1. **Network:** HTTPS/TLS
2. **Application:** Authentication, Authorization, Validation
3. **Data:** Encryption, Soft Delete
4. **Infrastructure:** Environment variables, Secrets management

### Security Features
- JWT token authentication
- Token refresh and blacklisting
- Rate limiting
- Input validation and sanitization
- SQL injection prevention (ORM)
- XSS protection
- CSRF protection
- Security headers (HSTS, CSP, etc.)

## Performance Optimizations

### Backend
- Database indexes on frequently queried fields
- Query optimization (select_related, prefetch_related)
- Pagination for list endpoints
- Caching (can be added)

### Frontend
- Code splitting with React.lazy()
- Lazy loading for images
- Memoization (useMemo, useCallback)
- Optimized re-renders with Context splitting

## Scalability Considerations

### Horizontal Scaling
- Stateless API design (JWT tokens)
- Database connection pooling
- Load balancer ready

### Vertical Scaling
- Optimized database queries
- Efficient data structures
- Minimal dependencies

## Deployment Architecture

### Development
- Single server (Django + React dev servers)
- Local PostgreSQL database
- File-based logging

### Production
- **Backend:** Gunicorn + Nginx
- **Frontend:** Nginx static files
- **Database:** PostgreSQL (managed or self-hosted)
- **Static/Media:** Cloud storage (optional)

## Design Patterns Used

### Frontend
- **Component Pattern** - Reusable UI components
- **Context Pattern** - Global state management
- **Service Pattern** - API abstraction
- **Hook Pattern** - Reusable logic

### Backend
- **Service Layer Pattern** - Business logic separation
- **Repository Pattern** - Data access abstraction
- **Factory Pattern** - Object creation
- **Middleware Pattern** - Cross-cutting concerns

## API Design Principles

### RESTful Conventions
- **GET** - Retrieve resources
- **POST** - Create resources
- **PUT** - Update resources (full)
- **PATCH** - Update resources (partial)
- **DELETE** - Delete resources

### Response Format
```json
{
  "data": {...},
  "error": {
    "code": "error_code",
    "message": "User-friendly message",
    "status_code": 400
  }
}
```

## Future Considerations

### Potential Enhancements
- Real-time updates (WebSockets)
- Caching layer (Redis)
- Search functionality (Elasticsearch)
- File storage (AWS S3, Cloudinary)
- Monitoring (Sentry, DataDog)
- CI/CD pipeline

## Related Documentation

- [API Reference](./backend/api-reference.md)
- [Backend Authentication](./backend/authentication.md)
- [Frontend Service Layer](./frontend/service-layer.md)
- [Frontend Components](./frontend/components.md)

---

**Want to dive deeper?** Check out [API Reference](./backend/api-reference.md) and [Frontend Components](./frontend/components.md).















