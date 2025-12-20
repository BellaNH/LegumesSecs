# Authentication & Authorization

Complete guide to authentication and authorization in LegumeSec.

## Overview

LegumeSec uses JWT (JSON Web Tokens) for authentication and implements role-based access control (RBAC) with model-level permissions.

## Authentication Flow

### 1. Login Process

```javascript
// Frontend
const response = await authService.login(email, password);
const { access, refresh } = response.data;
localStorage.setItem('token', access);
localStorage.setItem('refreshToken', refresh);
```

### 2. Token Storage

- **Access Token:** Stored in `localStorage` as `token`
- **Refresh Token:** Stored in `localStorage` as `refreshToken`
- **Lifetime:**
  - Access Token: 60 minutes
  - Refresh Token: 7 days

### 3. Request Authentication

All authenticated requests include the token:

```http
Authorization: Bearer <access_token>
```

The API client automatically adds this header.

### 4. Token Refresh

When access token expires (401 error), the system automatically refreshes:

```javascript
// Automatic refresh handled by API client
// If refresh fails, user is logged out
```

## User Roles

### Role Types

1. **admin** - Full system access
2. **agent_dsa** - Access limited to assigned Wilaya
3. **agent_subdivision** - Access limited to assigned Subdivision
4. **user** - Basic user (customizable permissions)

### Role Hierarchy

```
admin (full access)
  ↓
agent_dsa (wilaya scope)
  ↓
agent_subdivision (subdivision scope)
  ↓
user (permission-based)
```

## Permissions System

### Model-Level Permissions

Each user can have permissions for specific models:

- **Agriculteur** - CRUD permissions
- **Exploitation** - CRUD permissions
- **Objectif** - CRUD permissions
- **Utilisateur** - CRUD permissions

### Permission Types

- `create` - Can create new records
- `retrieve` - Can view records
- `update` - Can modify records
- `destroy` - Can delete records

### Permission Checking

Permissions are checked automatically by `HasModelPermissions` permission class.

## Scope Filtering

### Agent DSA Scope

Users with `agent_dsa` role are automatically filtered to their assigned Wilaya:

```python
# Backend automatically filters
queryset = queryset.filter(
    commune__subdivision__wilaya=user_wilaya
)
```

### Agent Subdivision Scope

Users with `agent_subdivision` role are filtered to their assigned Subdivision:

```python
queryset = queryset.filter(
    commune__subdivision=user_subdivision
)
```

## API Endpoints

### Login

```http
POST /api/token/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Refresh Token

```http
POST /api/token/refresh/
Content-Type: application/json

{
  "refresh": "refresh_token_here"
}
```

### Logout

```http
POST /api/logout/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refresh_token": "refresh_token_here"
}
```

### Get Current User

```http
GET /api/me/
Authorization: Bearer <access_token>
```

## Frontend Implementation

### Auth Context

```javascript
import { useAuth } from '../contexts/AuthContext';

const { user, isAuthenticated, login, logout } = useAuth();
```

### Login Component

```javascript
const handleLogin = async (email, password) => {
  try {
    const { access, refresh } = await authService.login(email, password);
    await login(access, refresh);
    navigate('/dashboard');
  } catch (error) {
    showError('Identifiants invalides');
  }
};
```

### Protected Routes

```javascript
{isAuthenticated ? <Dashboard /> : <Login />}
```

### Automatic Token Refresh

The API client automatically handles token refresh:

```javascript
// In api/client.js
// Interceptor handles 401 errors and refreshes token
```

## Backend Implementation

### Permission Classes

#### HasModelPermissions

Checks model-level permissions:

```python
class MyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasModelPermissions]
    model_name = "Agriculteur"  # Required
```

#### GenericRolePermission

Checks role-based permissions:

```python
class MyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, GenericRolePermission]
    model_name = "Espece"
```

### Scope Filtering

Automatic scope filtering in views:

```python
def get_queryset(self):
    user = self.request.user
    queryset = MyModel.objects.all()
    
    # Automatic filtering based on role
    if user.role.nom.lower() == "agent_dsa":
        # Filtered to user's wilaya
    elif user.role.nom.lower() == "agent_subdivision":
        # Filtered to user's subdivision
```

## Security Features

### Token Security

- **Short-lived access tokens** - 60 minutes
- **Token rotation** - New refresh token on refresh
- **Token blacklisting** - Logged out tokens are blacklisted
- **Secure storage** - Tokens in localStorage (consider httpOnly cookies for production)

### Rate Limiting

- **Login:** 5 attempts per minute per IP
- **Password Reset:** 5 attempts per hour per IP

### Password Security

- Minimum 8 characters
- Hashed using Django's password hashers
- Never stored in plain text

## Best Practices

### Frontend

1. **Store tokens securely** - Use localStorage (or httpOnly cookies)
2. **Handle token expiration** - Automatic refresh on 401
3. **Clear tokens on logout** - Remove from storage
4. **Protect routes** - Check authentication before rendering

### Backend

1. **Always check permissions** - Use permission classes
2. **Apply scope filtering** - Filter data by user scope
3. **Validate tokens** - Check token validity and blacklist
4. **Log authentication events** - Track login/logout

## Troubleshooting

### Token Expired

**Symptom:** 401 Unauthorized errors

**Solution:** Token refresh is automatic. If refresh fails, user must login again.

### Permission Denied

**Symptom:** 403 Forbidden errors

**Solution:** Check user permissions and role assignments.

### Scope Issues

**Symptom:** User sees no data

**Solution:** Verify user has assigned Wilaya/Subdivision for agent roles.

## Related Documentation

- [API Reference](./api-reference.md) - Authentication endpoints
- [Security Guide](./validation-security.md) - Security best practices
- [Frontend Service Layer](../frontend/service-layer.md) - API client usage

---

**Need more details?** Check [API Reference](./api-reference.md) for endpoint details.









