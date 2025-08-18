#!/bin/bash

set -e

echo "🚀 Starting deployment..."

git pull origin main

echo "📦 Deploying backend..."
cd backend
poetry install --no-dev
poetry run prisma generate
poetry run prisma db push
sudo systemctl restart aasan-rishte-backend

echo "🎨 Deploying frontend..."
cd ../frontend
npm ci --production
npm run build
sudo systemctl restart aasan-rishte-frontend

sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"
