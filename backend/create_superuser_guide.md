# Creating a Superuser

## Method 1: Using Django Command (Recommended)

```bash
python manage.py createsuperuser
```

This will prompt you for:
- Email
- Nom (first name)
- Prenom (last name)
- Phone number
- Password

## Method 2: Using Django Shell

```bash
python manage.py shell
```

Then run:
```python
from api.models import CustomUser, Role

# Get or create admin role
role, _ = Role.objects.get_or_create(nom='admin')

# Create superuser
user = CustomUser.objects.create_superuser(
    nom='Admin',
    prenom='User',
    email='admin@example.com',
    phoneNum=1234567890,
    password='your_password_here'
)
print(f"Superuser created: {user.email}")
```

## Method 3: Using SQL (Advanced)

⚠️ **Warning**: This requires password hashing. Use Method 1 or 2 instead.

If you must use SQL, first get the hashed password:

```bash
python manage.py shell
```

```python
from django.contrib.auth.hashers import make_password
password_hash = make_password('your_password_here')
print(password_hash)
# Copy the output
```

Then use this SQL (replace `YOUR_HASHED_PASSWORD` with the output above):

```sql
-- First, ensure admin role exists
INSERT INTO api_role (nom, deleted) 
VALUES ('admin', NULL)
ON CONFLICT DO NOTHING;

-- Get the role ID (adjust if needed)
-- SELECT id FROM api_role WHERE nom = 'admin';

-- Create the superuser
INSERT INTO api_customuser (
    email,
    password,
    nom,
    prenom,
    phoneNum,
    role_id,
    is_staff,
    is_active,
    is_superuser,
    createDate,
    deleted
) VALUES (
    'admin@example.com',
    'YOUR_HASHED_PASSWORD',  -- Replace with output from make_password()
    'Admin',
    'User',
    1234567890,
    (SELECT id FROM api_role WHERE nom = 'admin' LIMIT 1),
    true,
    true,
    true,
    NOW(),
    NULL
);
```







