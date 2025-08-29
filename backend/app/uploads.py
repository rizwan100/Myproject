from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.database import db
from app.auth_utils import get_current_user
from google.cloud import storage
from google.api_core import exceptions as gcp_exceptions
import os
from datetime import timedelta
import uuid

router = APIRouter(prefix="/upload", tags=["uploads"])

class PresignedUrlResponse(BaseModel):
    url: str
    fields: dict
    fileId: str

# GCP config
GCP_BUCKET_NAME = os.getenv("GCP_BUCKET_NAME", "aasan-rishte-uploads")

def get_gcs_client():
    # The client will automatically use credentials from the environment
    # (e.g., GOOGLE_APPLICATION_CREDENTIALS)
    if not GCP_BUCKET_NAME:
        return None
    try:
        return storage.Client()
    except Exception:
        # Could fail if credentials are not set up correctly
        return None

@router.post("/presign", response_model=PresignedUrlResponse)
async def create_presigned_post(
    filename: str,
    content_type: str,
    file_type: str,  # "photo" or "document"
    current_user = Depends(get_current_user)
):
    if file_type not in ["photo", "document"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    if file_type == "photo":
        allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        max_size = 5 * 1024 * 1024  # 5MB
    else:  # document
        allowed_types = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        max_size = 2 * 1024 * 1024  # 2MB
    
    if content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"Invalid content type for {file_type}")
    
    user_profile = await db.profile.find_unique(where={"userId": current_user.id})
    if not user_profile:
        raise HTTPException(status_code=400, detail="Please create your profile first")
    
    gcs_client = get_gcs_client()
    if not gcs_client:
        # This part handles local development without GCS credentials
        # It returns a mock response and saves a mock URL to the DB
        file_id = str(uuid.uuid4())
        mock_url = f"https://storage.googleapis.com/mock-bucket/{file_type}s/{current_user.id}/{file_id}/{filename}"
        
        if file_type == "photo":
            photo_count = await db.photo.count(where={"profileId": user_profile.id})
            if photo_count >= 6:
                raise HTTPException(status_code=400, detail="Maximum 6 photos allowed")
            
            await db.photo.create(
                data={
                    "profileId": user_profile.id,
                    "url": mock_url,
                    "isPrimary": photo_count == 0  # First photo is primary
                }
            )
        else:  # document
            await db.document.create(
                data={
                    "profileId": user_profile.id,
                    "url": mock_url,
                    "type": "BIODATA_PDF" if content_type == "application/pdf" else ("BIODATA_DOC" if content_type == "application/msword" else "BIODATA_DOCX")
                }
            )
        
        return PresignedUrlResponse(
            url="https://mock-upload-endpoint.com/upload",
            fields={
                "key": f"{file_type}s/{current_user.id}/{file_id}/{filename}",
                "Content-Type": content_type,
            },
            fileId=file_id
        )
    
    try:
        bucket = gcs_client.bucket(GCP_BUCKET_NAME)
        file_id = str(uuid.uuid4())
        blob_name = f"{file_type}s/{current_user.id}/{file_id}/{filename}"
        blob = bucket.blob(blob_name)
        
        policy = blob.generate_signed_post_policy_v4(
            expiration=timedelta(hours=1),
            Conditions=[
                ["starts-with", "$Content-Type", "image/" if file_type == "photo" else "application/"],
                ["content-length-range", 1, max_size]
            ],
            fields={
                'Content-Type': content_type
            }
        )
        
        file_url = f"https://storage.googleapis.com/{GCP_BUCKET_NAME}/{blob_name}"
        
        if file_type == "photo":
            photo_count = await db.photo.count(where={"profileId": user_profile.id})
            if photo_count >= 6:
                raise HTTPException(status_code=400, detail="Maximum 6 photos allowed")
            
            await db.photo.create(
                data={
                    "profileId": user_profile.id,
                    "url": file_url,
                    "isPrimary": photo_count == 0  # First photo is primary
                }
            )
        else:  # document
            await db.document.create(
                data={
                    "profileId": user_profile.id,
                    "url": file_url,
                    "type": "BIODATA_PDF" if content_type == "application/pdf" else ("BIODATA_DOC" if content_type == "application/msword" else "BIODATA_DOCX")
                }
            )
        
        return PresignedUrlResponse(
            url=policy['url'],
            fields=policy['fields'],
            fileId=file_id
        )
        
    except gcp_exceptions.GoogleAPICallError as e:
        raise HTTPException(status_code=500, detail=f"GCS error: {str(e)}")

@router.delete("/photo/{photo_id}")
async def delete_photo(photo_id: str, current_user = Depends(get_current_user)):
    photo = await db.photo.find_unique(
        where={"id": photo_id},
        include={"profile": True}
    )
    
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    if photo.profile.userId != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Delete from GCS
    gcs_client = get_gcs_client()
    if gcs_client and GCP_BUCKET_NAME and photo.url.startswith(f"https://storage.googleapis.com/{GCP_BUCKET_NAME}/"):
        try:
            bucket = gcs_client.bucket(GCP_BUCKET_NAME)
            # Extract blob name from URL
            blob_name = photo.url.split(f"https://storage.googleapis.com/{GCP_BUCKET_NAME}/", 1)[1]
            blob = bucket.blob(blob_name)
            blob.delete()
        except Exception as e:
            # Log the error but don't fail the request, as the DB entry is more critical
            print(f"Could not delete photo {photo_id} from GCS: {e}")

    await db.photo.delete(where={"id": photo_id})
    
    return {"message": "Photo deleted successfully"}

@router.delete("/document/{document_id}")
async def delete_document(document_id: str, current_user = Depends(get_current_user)):
    document = await db.document.find_unique(
        where={"id": document_id},
        include={"profile": True}
    )
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if document.profile.userId != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Delete from GCS
    gcs_client = get_gcs_client()
    if gcs_client and GCP_BUCKET_NAME and document.url.startswith(f"https://storage.googleapis.com/{GCP_BUCKET_NAME}/"):
        try:
            bucket = gcs_client.bucket(GCP_BUCKET_NAME)
            # Extract blob name from URL
            blob_name = document.url.split(f"https://storage.googleapis.com/{GCP_BUCKET_NAME}/", 1)[1]
            blob = bucket.blob(blob_name)
            blob.delete()
        except Exception as e:
            # Log the error but don't fail the request
            print(f"Could not delete document {document_id} from GCS: {e}")

    await db.document.delete(where={"id": document_id})
    
    return {"message": "Document deleted successfully"}
