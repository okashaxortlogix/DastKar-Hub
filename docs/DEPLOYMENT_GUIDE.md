# DastKar Hub — Production Deployment Guide

## Prerequisites
* Linux Server (Ubuntu 22.04 LTS / Debian 12 / AWS ECS / DigitalOcean Droplet)
* Docker 24+ & Docker Compose v2+
* Domain with DNS records pointed to server IP
* SSL/TLS Certificate (Let's Encrypt / Certbot / Cloudflare SSL)

---

## 1. Automated Deployment via Docker Compose

```bash
# 1. Clone repository
git clone https://github.com/dastkar-hub/dastkar-hub.git /opt/dastkar-hub
cd /opt/dastkar-hub

# 2. Configure environment
cp .env.production.example .env.production
nano .env.production

# 3. Build & start containers
docker compose up -d --build

# 4. Run database migrations inside backend container
docker compose exec backend php artisan migrate --force

# 5. Populate initial craft categories and master artisans (first deployment only)
docker compose exec backend php artisan db:seed --force
```

---

## 2. Zero-Downtime Rolling Update Workflow

```bash
# 1. Pull update
git pull origin master

# 2. Build new container images in background
docker compose build backend frontend

# 3. Run non-destructive database migrations
docker compose exec backend php artisan migrate --force

# 4. Gracefully cycle services
docker compose up -d --no-deps backend frontend queue-worker
docker compose exec backend php artisan queue:restart
```

---

## 3. Rollback Procedure

If a release exhibits critical regressions:

```bash
# 1. Check previous git commit tag
git checkout <previous-stable-tag>

# 2. Revert containers
docker compose up -d --build

# 3. Rollback migrations if necessary
docker compose exec backend php artisan migrate:rollback --step=1
```
