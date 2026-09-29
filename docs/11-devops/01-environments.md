# Environments

## Local

Docker Compose:
- React
- Laravel
- PostgreSQL
- Redis
- mail catcher
- object storage emulator if useful

## Development

Shared backend services with isolated data.

## Staging

Production-like configuration.
Test payment/courier environments.

## Production

Managed database preferred.
Separate credentials.
Backups.
Monitoring.
CDN/object storage.
Queue workers.

## Environment variables

Never commit secrets.

Example:

```text
APP_ENV=
APP_KEY=
APP_URL=

DB_CONNECTION=
DB_HOST=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

REDIS_HOST=

STORAGE_BUCKET=
STORAGE_REGION=
STORAGE_KEY=
STORAGE_SECRET=

PAYMENT_PROVIDER=
PAYMENT_API_KEY=

MAIL_...
```
