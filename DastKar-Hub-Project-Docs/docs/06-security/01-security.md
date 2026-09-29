# Security Requirements

## Authentication
- secure password hashing
- session/token rotation
- MFA for admins
- brute-force protection
- login anomaly monitoring

## Authorization
- RBAC
- Laravel Policies/Gates
- server-side ownership checks
- no trusting user-provided seller IDs

## API
- rate limiting
- request validation
- CSRF protection where applicable
- secure CORS
- API versioning
- idempotency for critical operations

## Data
- TLS
- encrypted secrets
- private storage for verification documents
- database backups
- least privilege

## Admin
- MFA mandatory
- separate privileged role
- audit logs
- short session lifetime
- suspicious-login alerts

## Files
Validate:
- MIME type
- extension
- size
- image dimensions
- malware/security scanning where practical

Never trust filename or client-provided MIME type.

## Payments

Do not store raw card data unless a compliant architecture explicitly requires it. Prefer provider-hosted/tokenized payment flows.
