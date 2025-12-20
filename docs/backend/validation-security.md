# Validation & Security

Input validation and security measures in LegumeSec.

## Input Validation

### Validation Layer

All user input is validated at multiple levels:

1. **Frontend Validation** - Immediate feedback
2. **Serializer Validation** - Data structure validation
3. **Model Validation** - Database constraints
4. **Custom Validators** - Business logic validation

### Custom Validators

Located in `backend/api/validators.py`:

#### Email Validation
```python
validate_email_format(email)
# Returns error message or None
```

#### Phone Number Validation
```python
validate_phone_number(phone)
# Validates 9-10 digit phone numbers
```

#### Decimal Validation
```python
validate_positive_decimal(value)
validate_decimal_range(value, min, max)
```

#### Coordinate Validation
```python
validate_latitude(lat)  # -90 to 90
validate_longitude(lng)  # -180 to 180
```

#### String Sanitization
```python
sanitize_string(text)
# Removes dangerous characters, trims whitespace
```

#### Password Strength
```python
validate_password_strength(password)
# Minimum 8 characters, checks complexity
```

### Serializer Validation

All serializers include validation:

```python
class CustomUserSerializer(serializers.ModelSerializer):
    def validate_email(self, value):
        # Custom email validation
        return sanitize_string(value)
    
    def validate_phoneNum(self, value):
        # Phone validation
        error = validate_phone_number(value)
        if error:
            raise serializers.ValidationError(error)
        return value
```

## Security Measures

### Environment Variables

**Never commit secrets to version control!**

All sensitive data in environment variables:
- `SECRET_KEY` - Django secret key
- `DB_PASSWORD` - Database password
- `CORS_ALLOWED_ORIGINS` - Allowed origins

### SQL Injection Prevention

Django ORM prevents SQL injection:

```python
# Safe - Uses parameterized queries
User.objects.filter(email=email)

# Never do this:
# User.objects.raw(f"SELECT * FROM users WHERE email='{email}'")
```

### XSS Protection

- **Input Sanitization** - All user input sanitized
- **Output Escaping** - Django templates escape by default
- **Content Security Policy** - Security headers configured

### CSRF Protection

- **CSRF Tokens** - Required for state-changing operations
- **SameSite Cookies** - Configured in production
- **CSRF Middleware** - Enabled by default

### Security Headers

Production settings include:

```python
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
X_FRAME_OPTIONS = 'DENY'
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
```

## Rate Limiting

### Endpoints Protected

- **Login:** 5 requests/minute per IP
- **Password Reset:** 5 requests/hour per IP

### Implementation

```python
@method_decorator(ratelimit(key='ip', rate='5/m', method='POST'))
def post(self, request):
    # Login logic
```

## Password Security

### Requirements

- Minimum 8 characters
- Stored as hash (never plain text)
- Django password validators enabled

### Password Reset

- Rate limited (5/hour)
- Requires email and new password
- Validates password strength

## Data Sanitization

### String Sanitization

All text inputs are sanitized:

```python
def sanitize_string(text):
    # Remove dangerous characters
    # Trim whitespace
    # Normalize unicode
    return cleaned_text
```

### Number Validation

All numeric inputs validated:

```python
# Ensures positive numbers
validate_positive_decimal(value)

# Ensures valid range
validate_decimal_range(value, min=0, max=1000)
```

## Error Handling

### Error Response Format

All errors follow standard format:

```json
{
  "error": {
    "code": "validation_error",
    "message": "User-friendly message",
    "status_code": 400
  }
}
```

### Error Codes

- `validation_error` - Invalid input (400)
- `not_found` - Resource not found (404)
- `permission_denied` - Insufficient permissions (403)
- `authentication_required` - Not authenticated (401)
- `internal_server_error` - Server error (500)

## Best Practices

### Input Validation

1. **Validate early** - Frontend + Backend
2. **Sanitize all input** - Remove dangerous characters
3. **Use type validation** - Ensure correct data types
4. **Check ranges** - Validate numeric ranges
5. **Validate format** - Email, phone, etc.

### Security

1. **Never trust user input** - Always validate
2. **Use parameterized queries** - Django ORM
3. **Store secrets securely** - Environment variables
4. **Enable security headers** - Production settings
5. **Rate limit sensitive endpoints** - Prevent abuse

### Error Messages

1. **User-friendly** - Clear, actionable messages
2. **Don't expose internals** - No stack traces in production
3. **Consistent format** - Standard error structure
4. **Log details** - Log full errors server-side

## Validation Examples

### Email Validation

```python
# Backend
email = serializer.validated_data['email']
error = validate_email_format(email)
if error:
    raise serializers.ValidationError({'email': error})
```

### Phone Validation

```python
phone = serializer.validated_data['phoneNum']
error = validate_phone_number(phone)
if error:
    raise serializers.ValidationError({'phoneNum': error})
```

### Decimal Range

```python
superficie = serializer.validated_data['superficie']
error = validate_decimal_range(superficie, min=0, max=10000)
if error:
    raise serializers.ValidationError({'superficie': error})
```

## Related Documentation

- [API Reference](./api-reference.md) - Endpoint details
- [Settings Guide](./settings.md) - Security configuration
- [Error Handling Guide](../guides/error-handling.md) - Error patterns

---

**Security concerns?** Review [Settings Guide](./settings.md) for security configuration.









