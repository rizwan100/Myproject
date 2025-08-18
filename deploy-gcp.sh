#!/bin/bash
set -e

PROJECT_ID="your-project-id"
REGION="us-central1"

echo "🚀 Deploying Aasan Rishte to GCP..."

echo "📦 Building backend..."
cd backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/aasan-rishte-backend

echo "🚀 Deploying backend to Cloud Run..."
gcloud run deploy aasan-rishte-backend \
    --image gcr.io/$PROJECT_ID/aasan-rishte-backend \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated

BACKEND_URL=$(gcloud run services describe aasan-rishte-backend \
    --region=$REGION \
    --format="value(status.url)")

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

FRONTEND_URL=$(gcloud run services describe aasan-rishte-frontend \
    --region=$REGION \
    --format="value(status.url)")

echo "✅ Deployment completed!"
echo "🌐 Frontend URL: $FRONTEND_URL"
echo "🔧 Backend URL: $BACKEND_URL"
