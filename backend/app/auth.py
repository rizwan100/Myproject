from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from prisma import Prisma
from app.utils import hash_password, verify_password, create_access_token, create_verification_token, verify_verification_token
from app.email_service import EmailService
from app.database import db
from app.auth_utils import get_current_user
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["authentication"])

class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class VerifyEmail(BaseModel):
    token: str

class ResendVerification(BaseModel):
    email: EmailStr

class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    createdAt: str

@router.post("/register")
async def register(user_data: UserRegister):
    existing_user = await db.user.find_unique(where={"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = hash_password(user_data.password)
    user = await db.user.create(
        data={
            "email": user_data.email,
            "passwordHash": hashed_password,
            "role": "USER",
            "verifiedAt": None
        }
    )
    
    verification_token = create_verification_token(user_data.email)
    email_sent = EmailService.send_verification_email(user_data.email, verification_token)
    
    if not email_sent:
        raise HTTPException(status_code=500, detail="Failed to send verification email")
    
    return {
        "message": "Registration successful! Please check your email to verify your account.",
        "email": user_data.email
    }

@router.post("/verify-email")
async def verify_email(verify_data: VerifyEmail):
    payload = verify_verification_token(verify_data.token)
    if not payload:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    
    email = payload.get("email")
    user = await db.user.find_unique(where={"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.verifiedAt:
        raise HTTPException(status_code=400, detail="Email already verified")
    
    await db.user.update(
        where={"id": user.id},
        data={"verifiedAt": datetime.utcnow()}
    )
    
    return {"message": "Email verified successfully! You can now log in."}

@router.post("/resend-verification")
async def resend_verification(resend_data: ResendVerification):
    user = await db.user.find_unique(where={"email": resend_data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.verifiedAt:
        raise HTTPException(status_code=400, detail="Email already verified")
    
    verification_token = create_verification_token(resend_data.email)
    email_sent = EmailService.send_verification_email(resend_data.email, verification_token)
    
    if not email_sent:
        raise HTTPException(status_code=500, detail="Failed to send verification email")
    
    return {"message": "Verification email sent successfully!"}

@router.post("/login")
async def login(user_data: UserLogin):
    user = await db.user.find_unique(where={"email": user_data.email})
    if not user or not verify_password(user_data.password, user.passwordHash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.verifiedAt:
        raise HTTPException(status_code=403, detail="Please verify your email before logging in")
    
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=user.id,
            email=user.email,
            role=user.role,
            createdAt=user.createdAt.isoformat()
        )
    }

@router.delete("/account")
async def delete_account(current_user = Depends(get_current_user)):
    
    if current_user.role == "ADMIN":
        raise HTTPException(status_code=400, detail="Admin accounts cannot be self-deleted. Contact another admin.")
    
    await db.user.delete(where={"id": current_user.id})
    
    return {"message": "Account deleted successfully"}

@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}
