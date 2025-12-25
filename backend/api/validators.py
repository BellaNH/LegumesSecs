import re
from django.core.validators import ValidationError
from decimal import Decimal, InvalidOperation


def validate_phone_number(value):
    if value is None:
        return
    
    phone_str = str(value)
    if not phone_str.isdigit():
        raise ValidationError("Le numéro de téléphone doit contenir uniquement des chiffres.")
    
    if len(phone_str) < 8 or len(phone_str) > 15:
        raise ValidationError("Le numéro de téléphone doit contenir entre 8 et 15 chiffres.")


def validate_email_format(value):
    if not value:
        return
    
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, value):
        raise ValidationError("Format d'email invalide.")


def validate_positive_decimal(value, field_name="Valeur"):
    if value is None:
        return
    
    try:
        decimal_value = Decimal(str(value))
        if decimal_value < 0:
            raise ValidationError(f"{field_name} doit être positif ou nul.")
    except (InvalidOperation, ValueError):
        raise ValidationError(f"{field_name} doit être un nombre décimal valide.")


def validate_decimal_range(value, min_value=None, max_value=None, field_name="Valeur"):
    if value is None:
        return
    
    try:
        decimal_value = Decimal(str(value))
        
        if min_value is not None and decimal_value < min_value:
            raise ValidationError(f"{field_name} doit être supérieur ou égal à {min_value}.")
        
        if max_value is not None and decimal_value > max_value:
            raise ValidationError(f"{field_name} doit être inférieur ou égal à {max_value}.")
            
    except (InvalidOperation, ValueError):
        raise ValidationError(f"{field_name} doit être un nombre décimal valide.")


def validate_year(value):
    if value is None:
        return
    
    current_year = 2025
    if value < 1900 or value > current_year + 10:
        raise ValidationError(f"L'année doit être entre 1900 et {current_year + 10}.")


def validate_latitude(value):
    if value is None:
        return
    
    try:
        lat = float(value)
        if lat < -90 or lat > 90:
            raise ValidationError("La latitude doit être entre -90 et 90.")
    except (ValueError, TypeError):
        raise ValidationError("La latitude doit être un nombre valide.")


def validate_longitude(value):
    if value is None:
        return
    
    try:
        lon = float(value)
        if lon < -180 or lon > 180:
            raise ValidationError("La longitude doit être entre -180 et 180.")
    except (ValueError, TypeError):
        raise ValidationError("La longitude doit être un nombre valide.")


def sanitize_string(value):
    if not isinstance(value, str):
        return value
    
    value = value.strip()
    value = re.sub(r'[<>]', '', value)
    return value


def validate_text_length(value, max_length, field_name="Champ"):
    if value is None:
        return
    
    if len(str(value)) > max_length:
        raise ValidationError(f"{field_name} ne peut pas dépasser {max_length} caractères.")


def validate_password_strength(password):
    if not password:
        return
    
    if len(password) < 8:
        raise ValidationError("Le mot de passe doit contenir au moins 8 caractères.")
    
    if len(password) > 128:
        raise ValidationError("Le mot de passe ne peut pas dépasser 128 caractères.")
    
    if not re.search(r'[A-Za-z]', password):
        raise ValidationError("Le mot de passe doit contenir au moins une lettre.")
    
    if not re.search(r'[0-9]', password):
        raise ValidationError("Le mot de passe doit contenir au moins un chiffre.")
















