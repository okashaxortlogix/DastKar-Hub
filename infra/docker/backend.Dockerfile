# DastKar Hub — Production Backend Dockerfile
# PHP 8.2 FPM with opcache, pdo_pgsql/pdo_mysql, redis, bcmath, and non-root artisan user

FROM php:8.2-fpm-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    postgresql-dev \
    oniguruma-dev \
    icu-dev \
    linux-headers \
    supervisor

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    intl \
    opcache \
    zip

# Install Redis extension via PECL
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Copy Composer binary
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Create non-root user for security
RUN addgroup -g 1000 dastkar && adduser -u 1000 -G dastkar -s /bin/sh -D dastkar

# Copy composer manifest files
COPY services/api/composer.json services/api/composer.lock ./

# Install dependencies (production optimized)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copy application source
COPY services/api ./

# Set permissions
RUN chown -R dastkar:dastkar /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Switch to non-root user
USER dastkar

# Expose port
EXPOSE 9000

CMD ["php-fpm"]
