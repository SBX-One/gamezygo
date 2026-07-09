FROM php:8.5-fpm-alpine

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-dev \
    bash \
    autoconf \
    g++ \
    make \
    linux-headers

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql zip gd bcmath

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Clean up dev tools to keep image small
RUN apk del autoconf g++ make linux-headers

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set user permissions (Laravel standard)
RUN chown -R www-data:www-data /var/www/html

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
