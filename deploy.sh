#!/bin/bash

set -e

echo "🛠️ Starting deployment..."
npm run build

echo "📦 Copying files in /var/www/vigilseekFrontend/out..."
sudo cp -R out/* /var/www/vigilseekFrontend/out/

echo "🔑 Setting permissions..."
sudo chown -R www-data:www-data /var/www/vigilseekFrontend/out
sudo find /var/www/vigilseekFrontend/out -type d -exec chmod 755 {} \;
sudo find /var/www/vigilseekFrontend/out -type f -exec chmod 644 {} \;

echo "🔄 Reloading Nginx..."
sudo systemctl restart nginx

echo "✅ Deployment completed successfully!"