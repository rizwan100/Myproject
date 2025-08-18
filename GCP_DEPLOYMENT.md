# 🚀 Aasan Rishte - Google Cloud Platform Deployment Guide

This comprehensive guide covers deploying the Aasan Rishte matrimonial application on Google Cloud Platform (GCP) using various services and deployment strategies.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [GCP Services Required](#gcp-services-required)
- [Prerequisites](#prerequisites)
- [Deployment Strategies](#deployment-strategies)
- [Step-by-Step Deployment](#step-by-step-deployment)
- [CI/CD with Cloud Build](#cicd-with-cloud-build)
- [Environment Configuration](#environment-configuration)
- [Security & Best Practices](#security--best-practices)
- [Monitoring & Logging](#monitoring--logging)
- [Cost Optimization](#cost-optimization)

## 🏗 Architecture Overview

### Application Components
- **Frontend**: Next.js 14 (React, TypeScript, Tailwind CSS)
- **Backend**: FastAPI (Python 3.12, Poetry)
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Local storage (Cloud Storage ready)
- **Real-time**: WebSocket chat functionality
- **Email**: SMTP integration for verification

### GCP Architecture
```
Internet → Cloud Load Balancer → Cloud Run (Frontend & Backend)
                                      ↓
                              Cloud SQL (PostgreSQL)
                                      ↓
                              Cloud Storage (Files)
                                      ↓
                              Cloud Memorystore (Redis)
```

## ☁️ GCP Services Required

### Core Services
- **Cloud Run**: Serverless containers for frontend and backend
- **Cloud SQL**: Managed PostgreSQL database
- **Cloud Storage**: File uploads and static assets
- **Cloud Load Balancing**: Traffic distribution and SSL termination
- **Cloud CDN**: Content delivery network

### Optional Services
- **Cloud Memorystore**: Redis for caching and sessions
- **Cloud Build**: CI/CD pipeline
- **Cloud Monitoring**: Application monitoring
- **Cloud Logging**: Centralized logging
- **Cloud IAM**: Identity and access management
- **Cloud DNS**: Domain name management

## 📋 Prerequisites

### 1. GCP Account Setup
```bash
# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Initialize and authenticate
gcloud init
gcloud auth login
gcloud auth application-default login
```

### 2. Enable Required APIs
```bash
# Enable necessary APIs
gcloud services enable run.googleapis.com
gcloud services enable sql-component.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage-component.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable redis.googleapis.com
```

### 3. Set Project Variables
```bash
export PROJECT_ID="your-project-id"
export REGION="us-central1"
export DB_INSTANCE_NAME="aasan-rishte-db"
export BACKEND_SERVICE_NAME="aasan-rishte-backend"
export FRONTEND_SERVICE_NAME="aasan-rishte-frontend"

gcloud config set project $PROJECT_ID
```

## 🎯 Deployment Strategies

### Strategy 1: Cloud Run + Cloud SQL (Recommended)
- **Frontend**: Cloud Run (containerized Next.js)
- **Backend**: Cloud Run (containerized FastAPI)
- **Database**: Cloud SQL PostgreSQL
- **Storage**: Cloud Storage
- **Cost**: ~$100-300/month

### Strategy 2: App Engine + Cloud SQL
- **Frontend**: App Engine Standard (Node.js)
- **Backend**: App Engine Standard (Python)
- **Database**: Cloud SQL PostgreSQL
- **Cost**: ~$150-400/month

### Strategy 3: GKE + Cloud SQL (Enterprise)
- **Frontend**: GKE cluster
- **Backend**: GKE cluster
- **Database**: Cloud SQL PostgreSQL
- **Cost**: ~$300-800/month

## 🚀 Step-by-Step Deployment (Cloud Run Strategy)

### Step 1: Create Cloud SQL Database

```bash
# Create Cloud SQL instance
gcloud sql instances create $DB_INSTANCE_NAME \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=$REGION \
    --storage-type=SSD \
    --storage-size=10GB \
    --storage-auto-increase

# Create database
gcloud sql databases create matrimonial_db --instance=$DB_INSTANCE_NAME

# Create database user
gcloud sql users create dbuser \
    --instance=$DB_INSTANCE_NAME \
    --password=secure-password-change-this
```

### Step 2: Create Cloud Storage Bucket

```bash
# Create bucket for file uploads
gsutil mb gs://${PROJECT_ID}-matrimonial-uploads

# Set bucket permissions
gsutil iam ch allUsers:objectViewer gs://${PROJECT_ID}-matrimonial-uploads
```

### Step 3: Build and Deploy Backend

Create `backend/cloudbuild.yaml`:
```yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/aasan-rishte-backend', '.']
    dir: 'backend'
  
  # Push the container image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/aasan-rishte-backend']
  
  # Deploy container image to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
    - 'run'
    - 'deploy'
    - 'aasan-rishte-backend'
    - '--image'
    - 'gcr.io/$PROJECT_ID/aasan-rishte-backend'
    - '--region'
    - 'us-central1'
    - '--platform'
    - 'managed'
    - '--allow-unauthenticated'
    - '--set-env-vars'
    - 'DATABASE_URL=postgresql://dbuser:secure-password-change-this@/matrimonial_db?host=/cloudsql/$PROJECT_ID:$REGION:$DB_INSTANCE_NAME'
    - '--add-cloudsql-instances'
    - '$PROJECT_ID:$REGION:$DB_INSTANCE_NAME'

images:
  - 'gcr.io/$PROJECT_ID/aasan-rishte-backend'
```

Deploy backend:
```bash
cd backend
gcloud builds submit --config=cloudbuild.yaml
```

### Step 4: Build and Deploy Frontend

Create `frontend/cloudbuild.yaml`:
```yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/aasan-rishte-frontend', '.']
    dir: 'frontend'
  
  # Push the container image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/aasan-rishte-frontend']
  
  # Deploy container image to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
    - 'run'
    - 'deploy'
    - 'aasan-rishte-frontend'
    - '--image'
    - 'gcr.io/$PROJECT_ID/aasan-rishte-frontend'
    - '--region'
    - 'us-central1'
    - '--platform'
    - 'managed'
    - '--allow-unauthenticated'
    - '--set-env-vars'
    - 'NEXT_PUBLIC_API_URL=https://aasan-rishte-backend-hash-uc.a.run.app'

images:
  - 'gcr.io/$PROJECT_ID/aasan-rishte-frontend'
```

Deploy frontend:
```bash
cd frontend
gcloud builds submit --config=cloudbuild.yaml
```

### Step 5: Set Up Load Balancer (Optional)

```bash
# Create static IP
gcloud compute addresses create aasan-rishte-ip --global

# Create SSL certificate
gcloud compute ssl-certificates create aasan-rishte-ssl \
    --domains=aasanrishte.com,www.aasanrishte.com

# Create backend service
gcloud compute backend-services create aasan-rishte-backend-service \
    --global

# Create URL map
gcloud compute url-maps create aasan-rishte-url-map \
    --default-service=aasan-rishte-backend-service

# Create HTTPS proxy
gcloud compute target-https-proxies create aasan-rishte-https-proxy \
    --url-map=aasan-rishte-url-map \
    --ssl-certificates=aasan-rishte-ssl

# Create forwarding rule
gcloud compute forwarding-rules create aasan-rishte-https-rule \
    --global \
    --target-https-proxy=aasan-rishte-https-proxy \
    --ports=443
```

## 🔄 CI/CD with Cloud Build

### Root Level `cloudbuild.yaml`

```yaml
steps:
  # Test Backend
  - name: 'python:3.12'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        cd backend
        pip install poetry
        poetry install
        poetry run prisma generate
        # Add tests here when available
    
  # Test Frontend
  - name: 'node:20'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        cd frontend
        npm ci
        npm run lint
        npm run build
  
  # Build Backend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/aasan-rishte-backend', './backend']
  
  # Build Frontend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/aasan-rishte-frontend', './frontend']
  
  # Push Backend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/aasan-rishte-backend']
  
  # Push Frontend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/aasan-rishte-frontend']
  
  # Deploy Backend
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
    - 'run'
    - 'deploy'
    - 'aasan-rishte-backend'
    - '--image'
    - 'gcr.io/$PROJECT_ID/aasan-rishte-backend'
    - '--region'
    - 'us-central1'
    - '--platform'
    - 'managed'
    - '--allow-unauthenticated'
    - '--set-env-vars'
    - 'DATABASE_URL=$$DATABASE_URL,JWT_SECRET=$$JWT_SECRET,EMAIL_HOST=$$EMAIL_HOST,EMAIL_PORT=$$EMAIL_PORT,EMAIL_USER=$$EMAIL_USER,EMAIL_PASSWORD=$$EMAIL_PASSWORD'
    - '--add-cloudsql-instances'
    - '$PROJECT_ID:us-central1:aasan-rishte-db'
    secretEnv: ['DATABASE_URL', 'JWT_SECRET', 'EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD']
  
  # Deploy Frontend
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
    - 'run'
    - 'deploy'
    - 'aasan-rishte-frontend'
    - '--image'
    - 'gcr.io/$PROJECT_ID/aasan-rishte-frontend'
    - '--region'
    - 'us-central1'
    - '--platform'
    - 'managed'
    - '--allow-unauthenticated'
    - '--set-env-vars'
    - 'NEXT_PUBLIC_API_URL=https://aasan-rishte-backend-hash-uc.a.run.app'

availableSecrets:
  secretManager:
  - versionName: projects/$PROJECT_ID/secrets/database-url/versions/latest
    env: 'DATABASE_URL'
  - versionName: projects/$PROJECT_ID/secrets/jwt-secret/versions/latest
    env: 'JWT_SECRET'
  - versionName: projects/$PROJECT_ID/secrets/email-host/versions/latest
    env: 'EMAIL_HOST'
  - versionName: projects/$PROJECT_ID/secrets/email-port/versions/latest
    env: 'EMAIL_PORT'
  - versionName: projects/$PROJECT_ID/secrets/email-user/versions/latest
    env: 'EMAIL_USER'
  - versionName: projects/$PROJECT_ID/secrets/email-password/versions/latest
    env: 'EMAIL_PASSWORD'

images:
  - 'gcr.io/$PROJECT_ID/aasan-rishte-backend'
  - 'gcr.io/$PROJECT_ID/aasan-rishte-frontend'
```

### Set Up Cloud Build Trigger

```bash
# Connect repository
gcloud builds triggers create github \
    --repo-name=Myproject \
    --repo-owner=rizwan100 \
    --branch-pattern="^main$" \
    --build-config=cloudbuild.yaml
```

## ⚙️ Environment Configuration

### Secret Manager Setup

```bash
# Create secrets
gcloud secrets create database-url --data-file=-
# Enter: postgresql://dbuser:secure-password@/matrimonial_db?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME

gcloud secrets create jwt-secret --data-file=-
# Enter: your-super-secret-jwt-key-min-32-chars

gcloud secrets create email-host --data-file=-
# Enter: smtp.gmail.com

gcloud secrets create email-port --data-file=-
# Enter: 587

gcloud secrets create email-user --data-file=-
# Enter: aasanrishtecontact@gmail.com

gcloud secrets create email-password --data-file=-
# Enter: your-app-password
```

### Cloud Run Environment Variables

```bash
# Backend environment variables
gcloud run services update aasan-rishte-backend \
    --region=us-central1 \
    --set-env-vars="CORS_ORIGINS=https://aasanrishte.com,https://www.aasanrishte.com" \
    --set-env-vars="UPLOAD_DIR=/tmp/uploads" \
    --set-env-vars="MAX_FILE_SIZE=10485760"

# Frontend environment variables
gcloud run services update aasan-rishte-frontend \
    --region=us-central1 \
    --set-env-vars="NEXT_PUBLIC_APP_NAME=Aasan Rishte" \
    --set-env-vars="NEXT_PUBLIC_SUPPORT_EMAIL=aasanrishtecontact@gmail.com" \
    --set-env-vars="NEXT_PUBLIC_SUPPORT_PHONE=+917569319126" \
    --set-env-vars="NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/+917569319126"
```

## 🔒 Security & Best Practices

### IAM Configuration

```bash
# Create service account for Cloud Run
gcloud iam service-accounts create aasan-rishte-runner \
    --display-name="Aasan Rishte Cloud Run Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:aasan-rishte-runner@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:aasan-rishte-runner@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"
```

### Security Checklist

- [ ] Enable Cloud SQL SSL connections
- [ ] Use Secret Manager for sensitive data
- [ ] Configure VPC for network isolation
- [ ] Set up Cloud Armor for DDoS protection
- [ ] Enable audit logging
- [ ] Configure firewall rules
- [ ] Use least privilege IAM roles
- [ ] Enable Cloud Security Command Center

### Network Security

```bash
# Create VPC network
gcloud compute networks create aasan-rishte-vpc --subnet-mode=custom

# Create subnet
gcloud compute networks subnets create aasan-rishte-subnet \
    --network=aasan-rishte-vpc \
    --range=10.0.0.0/24 \
    --region=$REGION

# Configure Cloud SQL for private IP
gcloud sql instances patch $DB_INSTANCE_NAME \
    --network=projects/$PROJECT_ID/global/networks/aasan-rishte-vpc \
    --no-assign-ip
```

## 📊 Monitoring & Logging

### Cloud Monitoring Setup

```bash
# Create notification channel
gcloud alpha monitoring channels create \
    --display-name="Email Alerts" \
    --type=email \
    --channel-labels=email_address=aasanrishtecontact@gmail.com

# Create uptime check
gcloud monitoring uptime create \
    --display-name="Aasan Rishte Frontend" \
    --http-check-path="/" \
    --hostname="your-frontend-url.run.app"
```

### Logging Configuration

```yaml
# logging.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluent-bit-config
data:
  fluent-bit.conf: |
    [SERVICE]
        Flush         1
        Log_Level     info
        Daemon        off
        Parsers_File  parsers.conf
        HTTP_Server   On
        HTTP_Listen   0.0.0.0
        HTTP_Port     2020

    [INPUT]
        Name              tail
        Path              /var/log/app/*.log
        Parser            json
        Tag               app.*
        Refresh_Interval  5

    [OUTPUT]
        Name  stackdriver
        Match *
```

### Health Checks

Update your backend to include health endpoints:

```python
# backend/app/health.py
from fastapi import APIRouter
from app.database import db
import asyncio

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

@router.get("/readiness")
async def readiness_check():
    # Add any startup checks here
    return {"status": "ready"}
```

## 💰 Cost Optimization

### Resource Sizing

```bash
# Optimize Cloud Run resources
gcloud run services update aasan-rishte-backend \
    --region=us-central1 \
    --memory=512Mi \
    --cpu=1 \
    --concurrency=100 \
    --min-instances=0 \
    --max-instances=10

gcloud run services update aasan-rishte-frontend \
    --region=us-central1 \
    --memory=256Mi \
    --cpu=1 \
    --concurrency=100 \
    --min-instances=0 \
    --max-instances=5
```

### Database Optimization

```bash
# Use smaller instance for development
gcloud sql instances patch $DB_INSTANCE_NAME \
    --tier=db-f1-micro \
    --storage-size=10GB \
    --storage-auto-increase-limit=20GB
```

### Cost Monitoring

```bash
# Set up budget alerts
gcloud billing budgets create \
    --billing-account=BILLING_ACCOUNT_ID \
    --display-name="Aasan Rishte Budget" \
    --budget-amount=100USD \
    --threshold-rule=percent=50 \
    --threshold-rule=percent=90
```

## 🚀 Deployment Commands

### Quick Deploy Script

Create `deploy-gcp.sh`:
```bash
#!/bin/bash
set -e

PROJECT_ID="your-project-id"
REGION="us-central1"

echo "🚀 Deploying Aasan Rishte to GCP..."

# Build and deploy backend
echo "📦 Building backend..."
cd backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/aasan-rishte-backend

echo "🚀 Deploying backend to Cloud Run..."
gcloud run deploy aasan-rishte-backend \
    --image gcr.io/$PROJECT_ID/aasan-rishte-backend \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated

# Get backend URL
BACKEND_URL=$(gcloud run services describe aasan-rishte-backend \
    --region=$REGION \
    --format="value(status.url)")

# Build and deploy frontend
echo "📦 Building frontend..."
cd ../frontend
gcloud builds submit --tag gcr.io/$PROJECT_ID/aasan-rishte-frontend

echo "🚀 Deploying frontend to Cloud Run..."
gcloud run deploy aasan-rishte-frontend \
    --image gcr.io/$PROJECT_ID/aasan-rishte-frontend \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars NEXT_PUBLIC_API_URL=$BACKEND_URL

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe aasan-rishte-frontend \
    --region=$REGION \
    --format="value(status.url)")

echo "✅ Deployment completed!"
echo "🌐 Frontend URL: $FRONTEND_URL"
echo "🔧 Backend URL: $BACKEND_URL"
```

### Database Migration Script

Create `migrate-db.sh`:
```bash
#!/bin/bash
set -e

PROJECT_ID="your-project-id"
REGION="us-central1"
DB_INSTANCE="aasan-rishte-db"

echo "🗄️ Running database migrations..."

# Connect to Cloud SQL and run migrations
gcloud sql connect $DB_INSTANCE --user=dbuser --database=matrimonial_db

# Or use Cloud SQL Proxy
cloud_sql_proxy -instances=$PROJECT_ID:$REGION:$DB_INSTANCE=tcp:5432 &
PROXY_PID=$!

# Wait for proxy to start
sleep 5

# Run Prisma migrations
cd backend
DATABASE_URL="postgresql://dbuser:password@localhost:5432/matrimonial_db" \
poetry run prisma db push

# Kill proxy
kill $PROXY_PID

echo "✅ Database migrations completed!"
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] GCP project created and billing enabled
- [ ] Required APIs enabled
- [ ] Service accounts configured
- [ ] Secrets stored in Secret Manager
- [ ] Domain name configured (if using custom domain)

### Deployment
- [ ] Cloud SQL instance created and configured
- [ ] Cloud Storage bucket created
- [ ] Backend deployed to Cloud Run
- [ ] Frontend deployed to Cloud Run
- [ ] Environment variables configured
- [ ] Database migrations run

### Post-Deployment
- [ ] Health checks configured
- [ ] Monitoring and alerting set up
- [ ] SSL certificates configured
- [ ] CDN enabled
- [ ] Backup strategy implemented
- [ ] Cost monitoring configured

## 🔧 Troubleshooting

### Common Issues

1. **Cloud SQL Connection Issues**
   ```bash
   # Check Cloud SQL instance status
   gcloud sql instances describe $DB_INSTANCE_NAME
   
   # Test connection
   gcloud sql connect $DB_INSTANCE_NAME --user=dbuser
   ```

2. **Cloud Run Deployment Failures**
   ```bash
   # Check logs
   gcloud logs read "resource.type=cloud_run_revision" --limit=50
   
   # Check service status
   gcloud run services describe aasan-rishte-backend --region=$REGION
   ```

3. **Build Failures**
   ```bash
   # Check build logs
   gcloud builds log $(gcloud builds list --limit=1 --format="value(id)")
   ```

### Performance Optimization

```bash
# Enable Cloud CDN
gcloud compute backend-buckets create aasan-rishte-assets \
    --gcs-bucket-name=${PROJECT_ID}-matrimonial-uploads

# Configure caching
gcloud compute backend-services update aasan-rishte-backend-service \
    --global \
    --enable-cdn \
    --cache-mode=CACHE_ALL_STATIC
```

## 📞 Support

For deployment issues or questions:
- **Email**: aasanrishtecontact@gmail.com
- **Phone**: +917569319126
- **WhatsApp**: [wa.me/+917569319126](https://wa.me/+917569319126)

---

**Estimated Monthly Costs (USD)**:
- **Development**: $50-100 (f1-micro instances)
- **Production**: $200-500 (optimized instances)
- **High Traffic**: $500-1000+ (auto-scaling enabled)

This guide provides a complete deployment strategy for GCP. Start with the Cloud Run approach for the best balance of cost, performance, and ease of management.
