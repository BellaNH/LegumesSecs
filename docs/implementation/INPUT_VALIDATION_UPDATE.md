# Input Validation & Sanitization Implementation

## Overview
Comprehensive input validation and sanitization has been implemented across all serializers and views to prevent security vulnerabilities and ensure data integrity.

## Changes Implemented

### 1. Validation Utilities (`backend/api/validators.py`)

Created a centralized validation module with the following validators:

- **`validate_phone_number(value)`** - Validates phone numbers (8-15 digits)
- **`validate_email_format(value)`** - Validates email format using regex
- **`validate_positive_decimal(value, field_name)`** - Ensures decimal values are positive
- **`validate_decimal_range(value, min, max, field_name)`** - Validates decimal ranges
- **`validate_year(value)`** - Validates year (1900 to current+10)
- **`validate_latitude(value)`** - Validates latitude (-90 to 90)
- **`validate_longitude(value)`** - Validates longitude (-180 to 180)
- **`sanitize_string(value)`** - Removes dangerous characters and trims whitespace
- **`validate_text_length(value, max_length, field_name)`** - Validates string length
- **`validate_password_strength(password)`** - Validates password strength (min 8 chars, letters + numbers)

### 2. Serializer Validations

#### EspeceSerializer
- ✅ Max length validation (100 chars)
- ✅ String sanitization
- ✅ Required field validation

#### WilayaSerializer
- ✅ Max length validation (100 chars)
- ✅ String sanitization
- ✅ Required field validation

#### SubDivisionSerializer
- ✅ Max length validation (100 chars)
- ✅ String sanitization
- ✅ Required field validation

#### CommuneSerializer
- ✅ Max length validation (100 chars)
- ✅ String sanitization
- ✅ Required field validation

#### RoleSerializer
- ✅ Max length validation (100 chars)
- ✅ String sanitization
- ✅ Required field validation

#### CustomUserSerializer
- ✅ Email format validation
- ✅ Phone number validation
- ✅ Password strength validation
- ✅ Max length validation for nom/prenom (15 chars)
- ✅ String sanitization
- ✅ Email normalization (lowercase, trimmed)

#### AgriculteurSerializer
- ✅ Phone number validation
- ✅ Max length validation (100 chars for nom/prenom)
- ✅ String sanitization
- ✅ Positive number validation for numero_carte_fellah

#### ExploitationSerializer
- ✅ Max length validation (nom: 100, lieu: 100, situation: 500)
- ✅ Decimal validation (positive, range check)
- ✅ Latitude/longitude validation
- ✅ String sanitization

#### ParcelleSerializer
- ✅ Year validation
- ✅ All decimal fields validated (positive, range)
- ✅ Cross-field validation (surface fields <= superficie)
- ✅ Exploitation superficie validation

#### ObjectifSerializer
- ✅ Year validation
- ✅ Decimal validation for objectif_production

#### PermissionsSerializer
- ✅ Max length validation (15 chars)
- ✅ String sanitization

#### CustomTokenObtainPairSerializer
- ✅ Email format validation
- ✅ Password validation
- ✅ User active status check

### 3. Query Parameter Validation

All views that accept query parameters now validate them:

- **SubDivisionsByWilayaView** - Validates wilaya_id (must be positive integer)
- **communeByWilayaView** - Validates wilaya_id (must be positive integer)
- **CommunesBySubdivisionView** - Validates subdivision_id (must be positive integer)
- **ExploitationFilteredList** - Validates wilaya_id, subdivision_id, commune_id
- **AgriculteurFilteredList** - Validates wilaya_id, subdivision_id, commune_id

All query parameters are:
- Converted to integers safely
- Checked for positive values
- Handled gracefully if invalid (returns empty queryset)

### 4. Security Improvements

#### String Sanitization
- Removes HTML tags (`<`, `>`)
- Trims whitespace
- Applied to all text fields

#### Input Length Limits
- All text fields respect model max_length constraints
- Prevents buffer overflow attacks
- Clear error messages

#### Type Validation
- All numeric inputs validated as correct type
- Decimal fields validated for proper format
- Integer fields validated for proper format

#### Range Validation
- Decimal fields have min/max ranges
- Coordinates validated to valid ranges
- Years validated to reasonable range

## Validation Rules Summary

### Text Fields
- All strings are sanitized (HTML tags removed, trimmed)
- Max length enforced based on model constraints
- Empty strings rejected for required fields

### Email Fields
- Format validated with regex
- Normalized to lowercase
- Trimmed of whitespace

### Phone Numbers
- Must be 8-15 digits
- Only numeric characters allowed

### Decimal Fields
- Must be positive (where applicable)
- Range validated (0 to 99,999,999.99 for most fields)
- Proper decimal format required

### Coordinates
- Latitude: -90 to 90
- Longitude: -180 to 180

### Years
- Range: 1900 to current year + 10

### Passwords
- Minimum 8 characters
- Maximum 128 characters
- Must contain at least one letter
- Must contain at least one number

## Error Messages

All validation errors provide clear, user-friendly messages in French:
- Field-specific error messages
- Clear indication of what's wrong
- Suggestions for valid values where applicable

## Testing Recommendations

1. **Test invalid inputs:**
   - Empty strings
   - Strings exceeding max length
   - Invalid email formats
   - Invalid phone numbers
   - Negative decimals
   - Out-of-range coordinates
   - Invalid years

2. **Test SQL injection attempts:**
   - SQL code in text fields
   - Special characters

3. **Test XSS attempts:**
   - HTML/JavaScript in text fields
   - Script tags

4. **Test boundary values:**
   - Maximum allowed values
   - Minimum allowed values
   - Edge cases

## Migration Notes

- No database migrations required
- All validations are at the serializer level
- Existing data is not affected
- New data will be validated going forward

## Benefits

1. **Security:** Prevents injection attacks, XSS, and data corruption
2. **Data Integrity:** Ensures all data meets business rules
3. **User Experience:** Clear error messages help users fix issues
4. **Maintainability:** Centralized validators make updates easy
5. **Consistency:** All fields validated uniformly
















