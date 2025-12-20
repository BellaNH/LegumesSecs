# API Reference

Complete API endpoint documentation for LegumeSec backend.

## Base URL

- **Development:** `http://localhost:8000/api/`
- **Production:** `https://api.yourdomain.com/api/`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <access_token>
```

## Response Format

### Success Response
```json
{
  "data": {...}
}
```

### Error Response
```json
{
  "error": {
    "code": "error_code",
    "message": "User-friendly error message",
    "status_code": 400
  }
}
```

## Authentication Endpoints

### Login

Obtain JWT tokens.

**Endpoint:** `POST /api/token/`

**Request:**
```json
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

**Rate Limit:** 5 requests per minute per IP

### Refresh Token

Refresh access token.

**Endpoint:** `POST /api/token/refresh/`

**Request:**
```json
{
  "refresh": "refresh_token_here"
}
```

**Response:**
```json
{
  "access": "new_access_token",
  "refresh": "new_refresh_token"  // If rotation enabled
}
```

### Logout

Blacklist refresh token.

**Endpoint:** `POST /api/logout/`

**Request:**
```json
{
  "refresh_token": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": "Déconnexion réussie."
}
```

### Get Current User

Get authenticated user information.

**Endpoint:** `GET /api/me/`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "nom": "Doe",
  "prenom": "John",
  "role": {
    "id": 1,
    "nom": "admin"
  },
  "wilaya": {...},  // If agent_dsa
  "subdivision": {...}  // If agent_subdivision
}
```

### Reset Password

Reset user password.

**Endpoint:** `POST /api/reset-password/`

**Request:**
```json
{
  "email": "user@example.com",
  "new_password": "newpassword123"
}
```

**Response:**
```json
{
  "success": "Mot de passe mis à jour avec succès."
}
```

**Rate Limit:** 5 requests per hour per IP

## Location Endpoints

### Get All Wilayas

**Endpoint:** `GET /api/wilaya/`

**Response:**
```json
[
  {
    "id": 1,
    "nom": "Alger"
  },
  ...
]
```

### Get All Subdivisions

**Endpoint:** `GET /api/subdivision/`

**Response:**
```json
[
  {
    "id": 1,
    "nom": "Subdivision 1",
    "wilaya": 1
  },
  ...
]
```

### Get Subdivisions by Wilaya

**Endpoint:** `GET /api/filterSubdivBywilaya/?wilaya=<wilaya_id>`

**Query Parameters:**
- `wilaya` (required): Wilaya ID (positive integer)

**Response:**
```json
[
  {
    "id": 1,
    "nom": "Subdivision 1",
    "wilaya": 1
  },
  ...
]
```

### Get All Communes

**Endpoint:** `GET /api/commune/`

**Response:**
```json
[
  {
    "id": 1,
    "nom": "Commune 1",
    "subdivision": 1
  },
  ...
]
```

### Get Communes by Wilaya

**Endpoint:** `GET /api/filterCommuneBywilaya/?wilaya=<wilaya_id>`

**Query Parameters:**
- `wilaya` (required): Wilaya ID (positive integer)

### Get Communes by Subdivision

**Endpoint:** `GET /api/filterCommuneBySubdiv/?subdivision=<subdivision_id>`

**Query Parameters:**
- `subdivision` (required): Subdivision ID (positive integer)

## Agriculteur Endpoints

### List Agriculteurs

**Endpoint:** `GET /api/agriculteur/`

**Query Parameters:**
- `page` (optional): Page number
- `page_size` (optional): Items per page (max 100)

**Response:**
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/agriculteur/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "nom": "Doe",
      "prenom": "John",
      "phoneNum": 123456789,
      "numero_carte_fellah": 987654321
    },
    ...
  ]
}
```

### Get Agriculteur

**Endpoint:** `GET /api/agriculteur/<id>/`

**Response:**
```json
{
  "id": 1,
  "nom": "Doe",
  "prenom": "John",
  "phoneNum": 123456789,
  "numero_carte_fellah": 987654321
}
```

### Create Agriculteur

**Endpoint:** `POST /api/agriculteur/`

**Request:**
```json
{
  "nom": "Doe",
  "prenom": "John",
  "phoneNum": 123456789,
  "numero_carte_fellah": 987654321
}
```

**Response:** Created agriculteur object

### Update Agriculteur

**Endpoint:** `PUT /api/agriculteur/<id>/` (full update)
**Endpoint:** `PATCH /api/agriculteur/<id>/` (partial update)

### Delete Agriculteur

**Endpoint:** `DELETE /api/agriculteur/<id>/`

**Response:** 204 No Content

### Filter Agriculteurs

**Endpoint:** `GET /api/agriculteur-filter/`

**Query Parameters:**
- `wilaya` (optional): Filter by wilaya ID
- `subdivision` (optional): Filter by subdivision ID
- `commune` (optional): Filter by commune ID

## Exploitation Endpoints

### List Exploitations

**Endpoint:** `GET /api/exploitation`

**Query Parameters:**
- `page`, `page_size` - Pagination

### Get Exploitation

**Endpoint:** `GET /api/exploitation/<id>/`

### Create Exploitation

**Endpoint:** `POST /api/exploitation/`

**Request:**
```json
{
  "nom": "Exploitation 1",
  "lieu": "Location",
  "superficie": 100.50,
  "situation": "Description",
  "longtitude": 2.3522,
  "latitude": 48.8566,
  "commune": 1,
  "agriculteur": 1
}
```

### Get Exploitations with Parcelles

**Endpoint:** `GET /api/exploitation-parcelles`

**Response:** Exploitations with nested parcelles

### Filter Exploitations

**Endpoint:** `GET /api/exploitations-filter/`

**Query Parameters:**
- `wilaya`, `subdivision`, `commune` - Location filters

## Parcelle Endpoints

### List Parcelles

**Endpoint:** `GET /api/parcelle/`

### Get Parcelle

**Endpoint:** `GET /api/parcelle/<id>/`

### Create Parcelle

**Endpoint:** `POST /api/parcelle/`

**Request:**
```json
{
  "exploitation": 1,
  "espece": 1,
  "annee": 2024,
  "superficie": 50.0,
  "sup_labouree": 45.0,
  "sup_emblavee": 40.0,
  "sup_sinsitree": 2.0,
  "sup_recoltee": 38.0,
  "sup_deserbee": 1.0,
  "prev_de_production": 1000.0,
  "production": 950.0,
  "engrais_de_fond": 50.0,
  "engrais_de_couverture": 30.0
}
```

## Analytics Endpoints

### Active Agriculteurs This Year

**Endpoint:** `GET /api/active_this_year/`

**Response:**
```json
{
  "count": 150
}
```

### Superficie Comparison by Espece

**Endpoint:** `GET /api/superficie_espece_comparaision/`

**Response:**
```json
[
  {
    "espece_nom": "Blé",
    "total_superficie": 1000.0,
    "total_sup_labouree": 950.0,
    "total_sup_emblavee": 900.0,
    "total_sup_recoltee": 850.0,
    "total_sup_sinistree": 50.0,
    "total_sup_deserbee": 10.0
  },
  ...
]
```

### Yearly Production

**Endpoint:** `GET /api/yearly_production/`

**Response:**
```json
[
  {
    "espece": "Blé",
    "yearly_production": [
      {"year": 2015, "total_production": 1000},
      {"year": 2016, "total_production": 1200},
      ...
    ]
  },
  ...
]
```

### Top Wilayas by Espece

**Endpoint:** `GET /api/top_wilayas/`

**Response:**
```json
[
  {
    "espece": "Blé",
    "top_locations": [
      {"label": "Alger", "total_production": 5000},
      {"label": "Oran", "total_production": 4000},
      {"label": "Constantine", "total_production": 3000}
    ]
  },
  ...
]
```

### Superficie Labouree, Sinistree, Production

**Endpoint:** `GET /api/sup_lab_sin_prod/`

**Response:**
```json
[
  {
    "espece": "Blé",
    "total_sup_labouree": 1000.0,
    "total_sup_sinistree": 50.0,
    "total_production": 5000.0
  },
  ...
]
```

### Previous vs Production

**Endpoint:** `GET /api/prev_vs_prod/`

**Response:**
```json
[
  {
    "espece": "Blé",
    "prev_de_production": 1000.0,
    "production": 950.0
  },
  ...
]
```

## User Management Endpoints

### List Users

**Endpoint:** `GET /api/user/`

**Permissions:** Requires user management permissions

### Create User

**Endpoint:** `POST /api/user/`

**Request:**
```json
{
  "nom": "Doe",
  "prenom": "John",
  "email": "john@example.com",
  "phoneNum": 123456789,
  "password": "securepassword123",
  "role": 1
}
```

## Objectif Endpoints

### List Objectifs

**Endpoint:** `GET /api/objectif/`

### Create Objectif

**Endpoint:** `POST /api/objectif/`

**Request:**
```json
{
  "wilaya": 1,
  "espece": 1,
  "annee": 2024,
  "objectif_production": 10000.0
}
```

## Espece Endpoints

### List Especes

**Endpoint:** `GET /api/espece/`

### Create Espece

**Endpoint:** `POST /api/espece/`

**Request:**
```json
{
  "nom": "Blé"
}
```

## Role Endpoints

### List Roles

**Endpoint:** `GET /api/role`

**Response:**
```json
[
  {
    "id": 1,
    "nom": "admin"
  },
  ...
]
```

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `validation_error` | Invalid input data |
| `not_found` | Resource not found |
| `permission_denied` | Insufficient permissions |
| `authentication_required` | Authentication required |
| `authentication_failed` | Invalid credentials |
| `internal_server_error` | Server error |

## Rate Limiting

- **Login:** 5 requests/minute per IP
- **Password Reset:** 5 requests/hour per IP
- **Other endpoints:** No limit (can be configured)

## Related Documentation

- [Authentication Guide](./guides/authentication.md)
- [API Usage Guide](./guides/api-usage.md)
- [Pagination & Filtering](./guides/pagination-filtering.md)
- [Error Handling](./guides/error-handling.md)

---

**Need examples?** Check [API Usage Guide](./guides/api-usage.md) for practical examples.









