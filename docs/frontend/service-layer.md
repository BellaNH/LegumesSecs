# Frontend Service Layer

API client and service layer documentation for the frontend.

## Overview

The frontend uses a centralized service layer for all API calls. This provides:
- Consistent API interface
- Automatic token management
- Centralized error handling
- Request/response interceptors

## API Client

### Setup

The API client is automatically configured in `context.jsx`:

```javascript
import { setupApiClient } from './services/api';

// In AuthContext
useEffect(() => {
  setupApiClient(refreshAccessToken, logout);
}, []);
```

### Base Configuration

```javascript
// services/api/client.js
const BASE_URL = import.meta.env.VITE_API_URL || 'https://legumessecs.onrender.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Service Files

### Auth Service

**File:** `services/api/authService.js`

```javascript
import authService from '../services/api/authService';

// Login
const { access, refresh } = await authService.login(email, password);

// Logout
await authService.logout(refreshToken);

// Refresh token
const { access, refresh } = await authService.refreshToken(refreshToken);

// Get current user
const user = await authService.getCurrentUser();

// Reset password
await authService.resetPassword(email, newPassword);
```

### Location Service

**File:** `services/api/locationService.js`

```javascript
import { locationService } from '../services/api';

// Get all wilayas
const wilayas = await locationService.getWilayas();

// Get subdivisions by wilaya
const subdivisions = await locationService.getSubdivisionsByWilaya(wilayaId);

// Get communes by wilaya
const communes = await locationService.getCommunesByWilaya(wilayaId);

// Get communes by subdivision
const communes = await locationService.getCommunesBySubdivision(subdivisionId);
```

### Agriculteur Service

**File:** `services/api/agriculteurService.js`

```javascript
import { agriculteurService } from '../services/api';

// Get all
const agriculteurs = await agriculteurService.getAll();

// Get by ID
const agriculteur = await agriculteurService.getById(id);

// Get filtered
const filtered = await agriculteurService.getFiltered({
  wilaya: wilayaId,
  subdivision: subdivisionId,
  commune: communeId
});

// Create
const newAgri = await agriculteurService.create(data);

// Update
const updated = await agriculteurService.update(id, data);

// Partial update
const patched = await agriculteurService.partialUpdate(id, data);

// Delete
await agriculteurService.delete(id);
```

### Exploitation Service

**File:** `services/api/exploitationService.js`

```javascript
import { exploitationService } from '../services/api';

// Get all
const exploitations = await exploitationService.getAll();

// Get with parcelles
const withParcelles = await exploitationService.getWithParcelles();

// Get filtered
const filtered = await exploitationService.getFiltered({
  wilaya: wilayaId
});

// Create, update, delete (same pattern as agriculteur)
```

### Parcelle Service

**File:** `services/api/parcelleService.js`

```javascript
import { parcelleService } from '../services/api';

// Standard CRUD operations
const parcelles = await parcelleService.getAll();
const parcelle = await parcelleService.getById(id);
const created = await parcelleService.create(data);
await parcelleService.update(id, data);
await parcelleService.delete(id);
```

### Analytics Service

**File:** `services/api/analyticsService.js`

```javascript
import { analyticsService } from '../services/api';

// Active agriculteurs this year
const count = await analyticsService.getActiveAgriculteursThisYear();

// Superficie comparison
const comparison = await analyticsService.getSuperficieEspeceComparison();

// Yearly production
const yearly = await analyticsService.getYearlyProduction();

// Top wilayas
const topWilayas = await analyticsService.getTopWilayas();

// Previous vs production
const comparison = await analyticsService.getPrevProductionVsProduction();
```

## Request Interceptors

### Automatic Token Injection

```javascript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Response Interceptors

### Automatic Token Refresh

```javascript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Retry original request
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(error.config);
      } else {
        // Refresh failed, logout
        logout();
      }
    }
    return Promise.reject(error);
  }
);
```

## Error Handling

### Standard Error Format

All errors follow this format:

```json
{
  "error": {
    "code": "error_code",
    "message": "User-friendly message",
    "status_code": 400
  }
}
```

### Error Handling Utility

```javascript
import { handleApiError } from '../utils/apiHelpers';

try {
  const data = await agriculteurService.getAll();
} catch (error) {
  const message = handleApiError(error);
  showError(message);
}
```

## Usage Examples

### In Components

```javascript
import { agriculteurService } from '../services/api';
import { useToast } from '../components/common/Toast';

function MyComponent() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await agriculteurService.getAll();
      setData(result);
    } catch (error) {
      showError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      await agriculteurService.create(formData);
      showSuccess('Agriculteur créé avec succès');
      loadData(); // Refresh list
    } catch (error) {
      showError('Erreur lors de la création');
    }
  };
}
```

### With Pagination

```javascript
import { agriculteurService } from '../services/api';
import usePagination from '../hooks/usePagination';

function PaginatedList() {
  const { page, pageSize, handlePageChange } = usePagination();
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    loadData();
  }, [page, pageSize]);

  const loadData = async () => {
    const response = await agriculteurService.getAll();
    // Assuming paginated response
    setData(response.results);
    setCount(response.count);
  };
}
```

## Best Practices

### 1. Use Services, Not Direct Axios

```javascript
// ✅ Good
const data = await agriculteurService.getAll();

// ❌ Bad
const response = await axios.get('/api/agriculteur/');
```

### 2. Handle Errors

```javascript
try {
  const data = await service.method();
} catch (error) {
  // Handle error appropriately
  showError(handleApiError(error));
}
```

### 3. Use Loading States

```javascript
const [loading, setLoading] = useState(false);

const loadData = async () => {
  setLoading(true);
  try {
    const data = await service.getAll();
    setData(data);
  } finally {
    setLoading(false);
  }
};
```

### 4. Refresh After Mutations

```javascript
const handleDelete = async (id) => {
  await service.delete(id);
  loadData(); // Refresh the list
};
```

## Service Structure

```
services/api/
├── client.js              # Axios instance
├── authService.js         # Authentication
├── locationService.js     # Locations
├── agriculteurService.js  # Agriculteurs
├── exploitationService.js # Exploitations
├── parcelleService.js     # Parcelles
├── userService.js         # Users
├── objectifService.js     # Objectifs
├── especeService.js       # Especes
├── roleService.js         # Roles
├── analyticsService.js    # Analytics
└── index.js              # Exports
```

## Related Documentation

- [Components Guide](./components.md) - Using services in components
- [API Reference](../backend/api-reference.md) - Backend endpoints

---

**Need examples?** Check [Components Guide](./components.md) for component examples.















