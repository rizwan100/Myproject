from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.database import db
from app.auth_utils import get_current_user
import boto3
from botocore.exceptions import ClientError
import os
from datetime import datetime, timedelta
import uuid

router = APIRouter(prefix="/upload", tags=["uploads"])

class PresignedUrlResponse(BaseModel):
    url: str
    fields: dict
    fileId: str

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

def get_s3_client():
    if not all([AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME]):
        return None
    
    return boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )

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
    
    s3_client = get_s3_client()
    if not s3_client:
        file_id = str(uuid.uuid4())
        mock_url = f"https://mock-s3-bucket.s3.amazonaws.com/{file_id}/{filename}"
        
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
                "key": f"{file_id}/{filename}",
                "Content-Type": content_type,
                "x-amz-algorithm": "AWS4-HMAC-SHA256"
            },
            fileId=file_id
        )
    
    try:
        file_id = str(uuid.uuid4())
        file_key = f"{file_type}s/{current_user.id}/{file_id}/{filename}"
        
        response = s3_client.generate_presigned_post(
            Bucket=S3_BUCKET_NAME,
            Key=file_key,
            Fields={"Content-Type": content_type},
            Conditions=[
                {"Content-Type": content_type},
                ["content-length-range", 1, max_size]
            ],
            ExpiresIn=3600  # 1 hour
        )
        
        file_url = f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{file_key}"
        
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
            url=response["url"],
            fields=response["fields"],
            fileId=file_id
        )
        
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"S3 error: {str(e)}")

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
    
    await db.document.delete(where={"id": document_id})
    
    return {"message": "Document deleted successfully"}
