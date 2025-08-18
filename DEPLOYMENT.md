# 🚀 Aasan Rishte - Deployment & CI/CD Guide

This guide provides comprehensive deployment strategies and CI/CD pipeline configurations for the Aasan Rishte matrimonial application.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Deployment Strategies](#deployment-strategies)
- [CI/CD Pipeline Setup](#cicd-pipeline-setup)
- [Platform-Specific Guides](#platform-specific-guides)
- [Environment Configuration](#environment-configuration)
- [Production Considerations](#production-considerations)
- [Monitoring & Maintenance](#monitoring--maintenance)

## 🏗 Architecture Overview

### Application Components
- **Frontend**: Next.js 14 (React, TypeScript, Tailwind CSS)
- **Backend**: FastAPI (Python 3.12, Poetry)
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Local storage (S3-ready)
- **Real-time**: WebSocket chat functionality
- **Email**: SMTP integration for verification

### Deployment Requirements
- Node.js 20+ for frontend
- Python 3.12+ for backend
- PostgreSQL 15+ for database
- Redis for caching (optional)
- SSL certificates for HTTPS
- Domain name and DNS configuration

## 🎯 Deployment Strategies

### 1. Cloud Platform Deployment (Recommended)

#### Option A: Vercel + Railway + Neon
- **Frontend**: Vercel (automatic deployments)
- **Backend**: Railway (container deployment)
- **Database**: Neon PostgreSQL (managed)

#### Option B: Netlify + Render + Supabase
- **Frontend**: Netlify (JAMstack deployment)
- **Backend**: Render (container deployment)
- **Database**: Supabase PostgreSQL (managed)

#### Option C: AWS Full Stack
- **Frontend**: AWS Amplify or S3 + CloudFront
- **Backend**: AWS ECS or Lambda
- **Database**: AWS RDS PostgreSQL

### 2. VPS/Server Deployment

#### Single Server Setup
- **Server**: Ubuntu 22.04 LTS (2GB+ RAM, 20GB+ storage)
- **Web Server**: Nginx (reverse proxy)
- **Process Manager**: PM2 for Node.js, systemd for Python
- **Database**: PostgreSQL on same server

#### Multi-Server Setup
- **Frontend Server**: Nginx + Node.js
- **Backend Server**: Nginx + Python/FastAPI
- **Database Server**: PostgreSQL cluster

## 🔄 CI/CD Pipeline Setup

### GitHub Actions Configuration

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Aasan Rishte

on:
  push:
    branches: [main, production]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  PYTHON_VERSION: '3.12'

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install frontend dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run frontend linting
        run: |
          cd frontend
          npm run lint
      
      - name: Build frontend
        run: |
          cd frontend
          npm run build

  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ env.PYTHON_VERSION }}
      
      - name: Install Poetry
        uses: snok/install-poetry@v1
        with:
          version: latest
          virtualenvs-create: true
          virtualenvs-in-project: true
      
      - name: Install backend dependencies
        run: |
          cd backend
          poetry install
      
      - name: Run database migrations
        run: |
          cd backend
          poetry run prisma generate
          poetry run prisma db push
        env:
          DATABASE_URL: postgresql://postgres:test_password@localhost:5432/test_db
      
      - name: Run backend tests
        run: |
          cd backend
          poetry run python -m pytest
        env:
          DATABASE_URL: postgresql://postgres:test_password@localhost:5432/test_db

  deploy-frontend:
    needs: [test-frontend, test-backend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: frontend

  deploy-backend:
    needs: [test-frontend, test-backend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.0.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: aasan-rishte-backend
          working-directory: backend
```

### GitLab CI Configuration

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "20"
  PYTHON_VERSION: "3.12"

# Frontend Tests
test-frontend:
  stage: test
  image: node:20
  before_script:
    - cd frontend
    - npm ci
  script:
    - npm run lint
    - npm run build
  cache:
    paths:
      - frontend/node_modules/

# Backend Tests
test-backend:
  stage: test
  image: python:3.12
  services:
    - postgres:15
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: test_password
    DATABASE_URL: postgresql://postgres:test_password@postgres:5432/test_db
  before_script:
    - cd backend
    - pip install poetry
    - poetry install
  script:
    - poetry run prisma generate
    - poetry run prisma db push
    - poetry run python -m pytest

# Deploy to Production
deploy-production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - curl -X POST $WEBHOOK_URL
  only:
    - main
```

## 🌐 Platform-Specific Guides

### Vercel Deployment (Frontend)

1. **Setup Vercel Project**
   ```bash
   npm i -g vercel
   cd frontend
   vercel login
   vercel --prod
   ```

2. **Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL production
   vercel env add NEXT_PUBLIC_WEBSOCKET_URL production
   ```

3. **Build Configuration** (`vercel.json`):
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/next"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/$1"
       }
     ],
     "env": {
       "NEXT_PUBLIC_API_URL": "@api-url",
       "NEXT_PUBLIC_WEBSOCKET_URL": "@websocket-url"
     }
   }
   ```

### Railway Deployment (Backend)

1. **Setup Railway Project**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway link
   ```

2. **Railway Configuration** (`railway.toml`):
   ```toml
   [build]
   builder = "nixpacks"
   buildCommand = "poetry install && poetry run prisma generate"
   
   [deploy]
   startCommand = "poetry run uvicorn app.main:app --host 0.0.0.0 --port $PORT"
   healthcheckPath = "/health"
   healthcheckTimeout = 100
   restartPolicyType = "on_failure"
   
   [env]
   PORT = "8000"
   ```

3. **Environment Variables**
   ```bash
   railway variables set DATABASE_URL=postgresql://...
   railway variables set JWT_SECRET=your-secret-key
   railway variables set EMAIL_HOST=smtp.gmail.com
   railway variables set EMAIL_PORT=587
   railway variables set EMAIL_USER=your-email
   railway variables set EMAIL_PASSWORD=your-password
   ```

### Docker Deployment

#### Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Copy poetry files
COPY pyproject.toml poetry.lock* ./

# Configure poetry
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install --no-dev

# Copy application code
COPY . .

# Generate Prisma client
RUN poetry run prisma generate

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
      - NEXT_PUBLIC_WEBSOCKET_URL=ws://backend:8000
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/matrimonial_db
      - JWT_SECRET=your-secret-key
      - EMAIL_HOST=smtp.gmail.com
      - EMAIL_PORT=587
      - EMAIL_USER=your-email
      - EMAIL_PASSWORD=your-password
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=matrimonial_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
```

### AWS Deployment

#### Frontend (S3 + CloudFront)
```bash
# Build and deploy frontend
cd frontend
npm run build
aws s3 sync out/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### Backend (ECS with Fargate)
```json
{
  "family": "aasan-rishte-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/aasan-rishte-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://..."
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/aasan-rishte-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

## ⚙️ Environment Configuration

### Frontend Environment Variables
```bash
# .env.local (frontend)
NEXT_PUBLIC_API_URL=https://api.aasanrishte.com
NEXT_PUBLIC_WEBSOCKET_URL=wss://api.aasanrishte.com
NEXT_PUBLIC_APP_NAME="Aasan Rishte"
NEXT_PUBLIC_SUPPORT_EMAIL=aasanrishtecontact@gmail.com
NEXT_PUBLIC_SUPPORT_PHONE=+917569319126
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/+917569319126
```

### Backend Environment Variables
```bash
# .env (backend)
DATABASE_URL=postgresql://user:password@host:5432/matrimonial_db
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=aasanrishtecontact@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=aasanrishtecontact@gmail.com

# File Upload
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=10485760  # 10MB

# Redis (optional)
REDIS_URL=redis://localhost:6379

# CORS
CORS_ORIGINS=https://aasanrishte.com,https://www.aasanrishte.com

# Admin
ADMIN_EMAIL=aasanrishtecontact@gmail.com
ADMIN_PASSWORD=secure-admin-password
```

## 🔒 Production Considerations

### Security Checklist
- [ ] Use HTTPS everywhere (SSL certificates)
- [ ] Set secure JWT secrets (32+ characters)
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable database SSL connections
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Input validation and sanitization
- [ ] Rate limiting on APIs
- [ ] File upload restrictions

### Performance Optimization
- [ ] Enable gzip compression
- [ ] Use CDN for static assets
- [ ] Database connection pooling
- [ ] Redis caching for sessions
- [ ] Image optimization
- [ ] Code splitting (Next.js automatic)
- [ ] Database indexing
- [ ] API response caching
- [ ] WebSocket connection limits

### Monitoring Setup
```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

  loki:
    image: grafana/loki
    ports:
      - "3100:3100"

volumes:
  grafana_data:
```

### Backup Strategy
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Database backup
pg_dump $DATABASE_URL > $BACKUP_DIR/db_backup_$DATE.sql

# File uploads backup
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /app/uploads

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

## 📊 Monitoring & Maintenance

### Health Checks
```python
# backend/app/health.py
from fastapi import APIRouter
from app.database import db

router = APIRouter()

@router.get("/health")
async def health_check():
    try:
        # Check database connection
        await db.user.count()
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
```

### Log Management
```bash
# Setup log rotation
sudo tee /etc/logrotate.d/aasan-rishte << EOF
/var/log/aasan-rishte/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
        pm2 reloadLogs
    endscript
}
EOF
```

### Deployment Commands

#### Quick Deploy Script
```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Backend deployment
echo "📦 Deploying backend..."
cd backend
poetry install --no-dev
poetry run prisma generate
poetry run prisma db push
sudo systemctl restart aasan-rishte-backend

# Frontend deployment
echo "🎨 Deploying frontend..."
cd ../frontend
npm ci --production
npm run build
sudo systemctl restart aasan-rishte-frontend

# Restart nginx
sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"
```

#### Rollback Script
```bash
#!/bin/bash
# rollback.sh

COMMIT_HASH=$1

if [ -z "$COMMIT_HASH" ]; then
    echo "Usage: ./rollback.sh <commit-hash>"
    exit 1
fi

echo "🔄 Rolling back to commit: $COMMIT_HASH"

git checkout $COMMIT_HASH

# Rebuild and restart services
./deploy.sh

echo "✅ Rollback completed!"
```

## 🎯 Recommended Deployment Flow

### For Small to Medium Scale
1. **Frontend**: Vercel (automatic deployments from GitHub)
2. **Backend**: Railway (container deployment)
3. **Database**: Neon PostgreSQL (managed)
4. **Monitoring**: Railway built-in + Sentry for error tracking

### For Large Scale / Enterprise
1. **Frontend**: AWS CloudFront + S3
2. **Backend**: AWS ECS with Fargate
3. **Database**: AWS RDS PostgreSQL with read replicas
4. **Caching**: AWS ElastiCache (Redis)
5. **Monitoring**: AWS CloudWatch + Datadog
6. **CI/CD**: GitHub Actions + AWS CodeDeploy

### Cost Considerations
- **Vercel + Railway + Neon**: ~$50-100/month
- **AWS Full Stack**: ~$200-500/month (depending on traffic)
- **VPS Deployment**: ~$20-50/month (requires more maintenance)

---

**Need Help?**
- **Email**: aasanrishtecontact@gmail.com
- **Phone**: +917569319126
- **WhatsApp**: [wa.me/+917569319126](https://wa.me/+917569319126)
