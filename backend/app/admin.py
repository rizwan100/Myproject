from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel, EmailStr
from app.database import db
from app.auth_utils import admin_required
from app.utils import hash_password
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["admin"])

class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    createdAt: str
    verifiedAt: Optional[str]
    profile: Optional[dict]

class CreateAdminRequest(BaseModel):
    email: EmailStr
    password: str

@router.get("/users", response_model=List[UserResponse])
async def list_users(
    admin_user = Depends(admin_required),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None)
):
    skip = (page - 1) * limit
    where_clause = {}
    
    if search:
        where_clause = {
            "OR": [
                {"email": {"contains": search, "mode": "insensitive"}},
                {"profile": {"name": {"contains": search, "mode": "insensitive"}}}
            ]
        }
    
    users = await db.user.find_many(
        where=where_clause,
        include={"profile": True},
        skip=skip,
        take=limit,
        order={"createdAt": "desc"}
    )
    
    return [
        UserResponse(
            id=user.id,
            email=user.email,
            role=user.role,
            createdAt=user.createdAt.isoformat(),
            verifiedAt=user.verifiedAt.isoformat() if user.verifiedAt else None,
            profile={"name": user.profile.name, "gender": user.profile.gender} if user.profile else None
        )
        for user in users
    ]

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, admin_user = Depends(admin_required)):
    if user_id == admin_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
    
    user = await db.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    await db.user.delete(where={"id": user_id})
    
    return {"message": f"User {user.email} deleted successfully"}

@router.post("/users/admin")
async def create_admin_user(admin_data: CreateAdminRequest, admin_user = Depends(admin_required)):
    existing_user = await db.user.find_unique(where={"email": admin_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(admin_data.password)
    new_admin = await db.user.create(
        data={
            "email": admin_data.email,
            "passwordHash": hashed_password,
            "role": "ADMIN",
            "verifiedAt": datetime.utcnow()
        }
    )
    
    return {"message": f"Admin user {admin_data.email} created successfully", "id": new_admin.id}
