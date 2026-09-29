# DastKar Hub — Production Runbook

## Overview
This runbook provides technical procedures for operating, scaling, and maintaining DastKar Hub in production.

---

## 1. Service Architecture & Daemons

| Service | Technology | Port / Socket | Process Management |
| :--- | :--- | :--- | :--- |
| **Frontend Web** | React 19 / Vite SPA | 80 / 443 | Nginx Alpine Container |
| **API Backend** | PHP 8.2 FPM / Laravel 12 | 9000 (Internal) | PHP-FPM Daemon |
| **Relational DB** | PostgreSQL 16 | 5432 | Managed RDS / Container |
| **Cache & Sessions**| Redis 7 | 6379 | Redis Server (password protected) |
| **Queue Worker** | Laravel Artisan | N/A | `php artisan queue:work redis --queue=default,notifications,payments` |
| **Scheduler** | Laravel Artisan | N/A | `php artisan schedule:run` (cron every minute) |

---

## 2. Bootstrapping & Deployment Commands

```bash
# 1. Pull latest verified production image or code
git pull origin master

# 2. Install production dependencies
cd services/api
composer install --no-dev --optimize-autoloader

# 3. Cache configuration, routes, and events for maximum performance
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 4. Run database migrations safely
php artisan migrate --force

# 5. Restart background queue workers gracefully
php artisan queue:restart
```

---

## 3. Queue Management & Worker Monitoring

```bash
# Check queue status and failed jobs
php artisan queue:failed

# Retry all failed jobs
php artisan queue:retry all

# Flush dead-letter poison jobs
php artisan queue:flush
```

---

## 4. Health Checks & Diagnostics

* **API Health Check:** `GET /api/v1/categories` (verifies DB connection and API layer)
* **Log Inspection:** `services/api/storage/logs/laravel.log`
* **Nginx Access & Error Logs:** `/var/log/nginx/`
* **Redis Ping:** `redis-cli ping`
