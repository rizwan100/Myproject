from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from prisma import Prisma
from app.database import db
from app.auth_utils import get_current_user
from app.utils import JWT_SECRET, JWT_ALGORITHM
from typing import Optional, List, Any
from datetime import datetime, date
import math
import jwt

security = HTTPBearer(auto_error=False)

router = APIRouter(prefix="/profiles", tags=["profiles"])

class ProfileCreate(BaseModel):
    createdBy: str
    motherTongue: str
    name: str
    gender: str
    dob: date
    maritalStatus: str
    noOfChildren: str
    childrenLivingStatus: str
    religion: str
    caste: str
    citizenship: str
    residingCountry: str
    state: str
    city: str
    countryCode: str
    landline: Optional[str] = None
    mobileNumber: str
    food: str
    complexion: str
    bodyType: str
    heightCm: int
    weightKg: int
    physicalStatus: str
    bloodGroup: str
    educationQualification: str
    occupation: str
    employmentType: str
    annualIncomeCurrency: str
    annualIncome: int
    aboutMe: str

class ProfileResponse(BaseModel):
    id: str
    userId: str
    name: str
    gender: str
    age: int
    maritalStatus: str
    motherTongue: str
    religion: str
    caste: str
    city: str
    state: str
    residingCountry: str
    food: str
    complexion: str
    bodyType: str
    heightCm: int
    physicalStatus: str
    educationQualification: str
    occupation: str
    aboutMe: str
    approved: bool
    createdAt: str
    photos: List[dict] = []
    documents: List[dict] = []
    mobileNumber: Optional[str] = None  # Only shown for mutual matches or premium
    hasMutualInterest: bool = False  # Indicates if mutual interest exists

def calculate_age(birth_date: date) -> int:
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

@router.get("/me", response_model=ProfileResponse)
async def get_my_profile(current_user = Depends(get_current_user)):
    """Get current user's own profile for editing"""
    profile = await db.profile.find_unique(
        where={"userId": current_user.id},
        include={"photos": True, "documents": True}
    )
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return ProfileResponse(
        id=profile.id,
        userId=profile.userId,
        name=profile.name,
        gender=profile.gender,
        age=profile.age,
        maritalStatus=profile.maritalStatus,
        motherTongue=profile.motherTongue,
        religion=profile.religion,
        caste=profile.caste,
        city=profile.city,
        state=profile.state,
        residingCountry=profile.residingCountry,
        food=profile.food,
        complexion=profile.complexion,
        bodyType=profile.bodyType,
        heightCm=profile.heightCm,
        physicalStatus=profile.physicalStatus,
        educationQualification=profile.educationQualification,
        occupation=profile.occupation,
        aboutMe=profile.aboutMe,
        approved=profile.approved,
        createdAt=profile.createdAt.isoformat(),
        photos=[{"id": p.id, "url": p.url, "isPrimary": p.isPrimary} for p in profile.photos],
        documents=[{"id": d.id, "url": d.url, "type": d.type} for d in profile.documents],
        mobileNumber=profile.mobileNumber,  # Show full phone number for own profile
        hasMutualInterest=False
    )

@router.get("/user/{user_id}", response_model=ProfileResponse)
async def get_user_profile(user_id: str, current_user = Depends(get_current_user)):
    """Get profile by user ID - used by dashboard to check if profile exists"""
    profile = await db.profile.find_unique(
        where={"userId": user_id},
        include={"photos": True, "documents": True}
    )
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return ProfileResponse(
        id=profile.id,
        userId=profile.userId,
        name=profile.name,
        gender=profile.gender,
        age=profile.age,
        maritalStatus=profile.maritalStatus,
        motherTongue=profile.motherTongue,
        religion=profile.religion,
        caste=profile.caste,
        city=profile.city,
        state=profile.state,
        residingCountry=profile.residingCountry,
        food=profile.food,
        complexion=profile.complexion,
        bodyType=profile.bodyType,
        heightCm=profile.heightCm,
        physicalStatus=profile.physicalStatus,
        educationQualification=profile.educationQualification,
        occupation=profile.occupation,
        aboutMe=profile.aboutMe,
        approved=profile.approved,
        createdAt=profile.createdAt.isoformat(),
        photos=[{"id": p.id, "url": p.url, "isPrimary": p.isPrimary} for p in profile.photos],
        documents=[{"id": d.id, "url": d.url, "type": d.type} for d in profile.documents],
        mobileNumber=profile.mobileNumber,  # Show full phone number for own profile
        hasMutualInterest=False
    )

@router.post("/", response_model=ProfileResponse)
async def create_or_update_profile(profile_data: ProfileCreate, current_user = Depends(get_current_user)):
    existing_profile = await db.profile.find_unique(where={"userId": current_user.id})
    
    age = calculate_age(profile_data.dob)
    
    profile_data_dict = {
        "userId": current_user.id,
        "createdBy": profile_data.createdBy,
        "motherTongue": profile_data.motherTongue,
        "name": profile_data.name,
        "gender": profile_data.gender,
        "dob": datetime.combine(profile_data.dob, datetime.min.time()),
        "age": age,
        "maritalStatus": profile_data.maritalStatus,
        "noOfChildren": profile_data.noOfChildren,
        "childrenLivingStatus": profile_data.childrenLivingStatus,
        "religion": profile_data.religion,
        "caste": profile_data.caste,
        "citizenship": profile_data.citizenship,
        "residingCountry": profile_data.residingCountry,
        "state": profile_data.state,
        "city": profile_data.city,
        "countryCode": profile_data.countryCode,
        "landline": profile_data.landline,
        "mobileNumber": profile_data.mobileNumber,
        "hidePhoneNumber": False,
        "food": profile_data.food,
        "complexion": profile_data.complexion,
        "bodyType": profile_data.bodyType,
        "heightCm": profile_data.heightCm,
        "weightKg": profile_data.weightKg,
        "physicalStatus": profile_data.physicalStatus,
        "bloodGroup": profile_data.bloodGroup,
        "educationQualification": profile_data.educationQualification,
        "occupation": profile_data.occupation,
        "employmentType": profile_data.employmentType,
        "annualIncomeCurrency": profile_data.annualIncomeCurrency,
        "annualIncome": profile_data.annualIncome,
        "aboutMe": profile_data.aboutMe,
        "approved": True
    }
    
    if existing_profile:
        profile = await db.profile.update(
            where={"userId": current_user.id},
            data=profile_data_dict,
            include={"photos": True, "documents": True}
        )
    else:
        profile = await db.profile.create(
            data=profile_data_dict,
            include={"photos": True, "documents": True}
        )
    
    return ProfileResponse(
        id=profile.id,
        userId=profile.userId,
        name=profile.name,
        gender=profile.gender,
        age=profile.age,
        maritalStatus=profile.maritalStatus,
        motherTongue=profile.motherTongue,
        religion=profile.religion,
        caste=profile.caste,
        city=profile.city,
        state=profile.state,
        residingCountry=profile.residingCountry,
        food=profile.food,
        complexion=profile.complexion,
        bodyType=profile.bodyType,
        heightCm=profile.heightCm,
        physicalStatus=profile.physicalStatus,
        educationQualification=profile.educationQualification,
        occupation=profile.occupation,
        aboutMe=profile.aboutMe,
        approved=profile.approved,
        createdAt=profile.createdAt.isoformat(),
        photos=[{"id": p.id, "url": p.url, "isPrimary": p.isPrimary} for p in profile.photos],
        documents=[{"id": d.id, "url": d.url, "type": d.type} for d in profile.documents]
    )

@router.put("/me", response_model=ProfileResponse)
async def update_my_profile(profile_data: ProfileCreate, current_user = Depends(get_current_user)):
    """Update the current user's profile."""
    existing_profile = await db.profile.find_unique(where={"userId": current_user.id})
    if not existing_profile:
        raise HTTPException(status_code=404, detail="Profile not found. Please create one first.")

    age = calculate_age(profile_data.dob)
    
    profile_data_dict = {
        "createdBy": profile_data.createdBy,
        "motherTongue": profile_data.motherTongue,
        "name": profile_data.name,
        "gender": profile_data.gender,
        "dob": datetime.combine(profile_data.dob, datetime.min.time()),
        "age": age,
        "maritalStatus": profile_data.maritalStatus,
        "noOfChildren": profile_data.noOfChildren,
        "childrenLivingStatus": profile_data.childrenLivingStatus,
        "religion": profile_data.religion,
        "caste": profile_data.caste,
        "citizenship": profile_data.citizenship,
        "residingCountry": profile_data.residingCountry,
        "state": profile_data.state,
        "city": profile_data.city,
        "countryCode": profile_data.countryCode,
        "landline": profile_data.landline,
        "mobileNumber": profile_data.mobileNumber,
        "hidePhoneNumber": False,
        "food": profile_data.food,
        "complexion": profile_data.complexion,
        "bodyType": profile_data.bodyType,
        "heightCm": profile_data.heightCm,
        "weightKg": profile_data.weightKg,
        "physicalStatus": profile_data.physicalStatus,
        "bloodGroup": profile_data.bloodGroup,
        "educationQualification": profile_data.educationQualification,
        "occupation": profile_data.occupation,
        "employmentType": profile_data.employmentType,
        "annualIncomeCurrency": profile_data.annualIncomeCurrency,
        "annualIncome": profile_data.annualIncome,
        "aboutMe": profile_data.aboutMe,
        "approved": True
    }
    
    profile = await db.profile.update(
        where={"userId": current_user.id},
        data=profile_data_dict,
        include={"photos": True, "documents": True}
    )

    return ProfileResponse(
        id=profile.id,
        userId=profile.userId,
        name=profile.name,
        gender=profile.gender,
        age=profile.age,
        maritalStatus=profile.maritalStatus,
        motherTongue=profile.motherTongue,
        religion=profile.religion,
        caste=profile.caste,
        city=profile.city,
        state=profile.state,
        residingCountry=profile.residingCountry,
        food=profile.food,
        complexion=profile.complexion,
        bodyType=profile.bodyType,
        heightCm=profile.heightCm,
        physicalStatus=profile.physicalStatus,
        educationQualification=profile.educationQualification,
        occupation=profile.occupation,
        aboutMe=profile.aboutMe,
        approved=profile.approved,
        createdAt=profile.createdAt.isoformat(),
        photos=[{"id": p.id, "url": p.url, "isPrimary": p.isPrimary} for p in profile.photos],
        documents=[{"id": d.id, "url": d.url, "type": d.type} for d in profile.documents]
    )

async def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    """Get current user if authenticated, otherwise return None"""
    if not credentials:
        return None
    
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            return None
        
        user = await db.user.find_unique(where={"id": user_id}, include={"profile": True})
        return user
    except jwt.PyJWTError:
        return None

@router.get("/", response_model=List[ProfileResponse])
async def get_profiles(
    current_user = Depends(get_current_user_optional),
    lookingFor: Optional[str] = Query(None),
    ageMin: Optional[int] = Query(None),
    ageMax: Optional[int] = Query(None),
    caste: Optional[str] = Query(None),
    maritalStatus: Optional[str] = Query(None),
    motherTongue: Optional[str] = Query(None),
    heightMin: Optional[int] = Query(None),
    heightMax: Optional[int] = Query(None),
    complexion: Optional[str] = Query(None),
    education: Optional[str] = Query(None),
    occupation: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    where_clause: dict[str, Any] = {
        "approved": True,
        "visibilityGenderRule": True
    }
    
    if current_user and current_user.profile:
        user_profile = current_user.profile
        if user_profile.gender == "BRIDE":
            target_gender = "GROOM"
        else:
            target_gender = "BRIDE"
        where_clause["gender"] = target_gender
    elif lookingFor:
        where_clause["gender"] = lookingFor
    
    if ageMin or ageMax:
        age_filter = {}
        if ageMin:
            age_filter["gte"] = ageMin
        if ageMax:
            age_filter["lte"] = ageMax
        where_clause["age"] = age_filter
    
    if caste:
        where_clause["caste"] = {"contains": caste, "mode": "insensitive"}
    
    if maritalStatus:
        where_clause["maritalStatus"] = maritalStatus
    
    if motherTongue:
        where_clause["motherTongue"] = {"contains": motherTongue, "mode": "insensitive"}
    
    if heightMin or heightMax:
        height_filter = {}
        if heightMin:
            height_filter["gte"] = heightMin
        if heightMax:
            height_filter["lte"] = heightMax
        where_clause["heightCm"] = height_filter
    
    if complexion:
        where_clause["complexion"] = complexion
    
    if education:
        where_clause["educationQualification"] = {"contains": education, "mode": "insensitive"}
    
    if occupation:
        where_clause["occupation"] = {"contains": occupation, "mode": "insensitive"}
    
    if country:
        where_clause["residingCountry"] = {"contains": country, "mode": "insensitive"}
    
    if state:
        where_clause["state"] = {"contains": state, "mode": "insensitive"}
    
    if city:
        where_clause["city"] = {"contains": city, "mode": "insensitive"}
    
    offset = (page - 1) * limit
    
    profiles = await db.profile.find_many(
        where=where_clause,
        include={"photos": True, "documents": True},
        skip=offset,
        take=limit,
        order={"createdAt": "desc"}
    )
    
    def has_mutual_interest(profile_user_id: str) -> bool:
        if not current_user:
            return False
        return False
    
    return [
        ProfileResponse(
            id=profile.id,
            userId=profile.userId,
            name=profile.name,
            gender=profile.gender,
            age=profile.age,
            maritalStatus=profile.maritalStatus,
            motherTongue=profile.motherTongue,
            religion=profile.religion,
            caste=profile.caste,
            city=profile.city,
            state=profile.state,
            residingCountry=profile.residingCountry,
            food=profile.food,
            complexion=profile.complexion,
            bodyType=profile.bodyType,
            heightCm=profile.heightCm,
            physicalStatus=profile.physicalStatus,
            educationQualification=profile.educationQualification,
            occupation=profile.occupation,
            aboutMe=profile.aboutMe,
            approved=profile.approved,
            createdAt=profile.createdAt.isoformat(),
            photos=[{"id": p.id, "url": p.url, "isPrimary": p.isPrimary} for p in profile.photos],
            documents=[{"id": d.id, "url": d.url, "type": d.type} for d in profile.documents],
            mobileNumber=profile.mobileNumber if (not profile.hidePhoneNumber and current_user) or has_mutual_interest(profile.userId) else ("Hidden" if profile.hidePhoneNumber else None)
        )
        for profile in profiles
    ]

@router.get("/{profile_id}", response_model=ProfileResponse)
async def get_profile(profile_id: str, current_user = Depends(get_current_user)):
    user_profile = await db.profile.find_unique(where={"userId": current_user.id})
    if not user_profile:
        raise HTTPException(status_code=400, detail="Please create your profile first")
    
    profile = await db.profile.find_unique(
        where={"id": profile_id},
        include={"photos": True, "documents": True}
    )
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    if user_profile.gender == profile.gender:
        raise HTTPException(status_code=403, detail="Cannot view profiles of same gender")
    
    if not profile.approved:
        raise HTTPException(status_code=403, detail="Profile not approved")
    
    mutual_interest = await db.interest.find_first(
        where={
            "OR": [
                {"fromUserId": current_user.id, "toUserId": profile.userId, "status": "ACCEPTED"},
                {"fromUserId": profile.userId, "toUserId": current_user.id, "status": "ACCEPTED"}
            ]
        }
    )
    
    show_phone = mutual_interest is not None
    
    return ProfileResponse(
        id=profile.id,
        userId=profile.userId,
        name=profile.name,
        gender=profile.gender,
        age=profile.age,
        maritalStatus=profile.maritalStatus,
        motherTongue=profile.motherTongue,
        religion=profile.religion,
        caste=profile.caste,
        city=profile.city,
        state=profile.state,
        residingCountry=profile.residingCountry,
        food=profile.food,
        complexion=profile.complexion,
        bodyType=profile.bodyType,
        heightCm=profile.heightCm,
        physicalStatus=profile.physicalStatus,
        educationQualification=profile.educationQualification,
        occupation=profile.occupation,
        aboutMe=profile.aboutMe,
        approved=profile.approved,
        createdAt=profile.createdAt.isoformat(),
        photos=[{"id": p.id, "url": p.url, "isPrimary": p.isPrimary} for p in profile.photos],
        documents=[{"id": d.id, "url": d.url, "type": d.type} for d in profile.documents],
        mobileNumber=profile.mobileNumber if (not getattr(profile, 'hidePhoneNumber', False) and show_phone) else ("Hidden" if getattr(profile, 'hidePhoneNumber', False) else None)
    )

@router.get("/by-name/{profile_name}", response_model=ProfileResponse)
async def get_profile_by_name(
    profile_name: str, 
    current_user = Depends(get_current_user_optional)
):
    profile = await db.profile.find_first(
        where={
            "name": {"equals": profile_name, "mode": "insensitive"},
            "approved": True
        },
        include={"photos": True, "documents": True}
    )
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    
    show_phone = current_user is not None
    
    has_mutual_interest = False
    if current_user:
        interest_from_current = await db.interest.find_first(
            where={
                "fromUserId": current_user.id,
                "toUserId": profile.userId,
                "status": "ACCEPTED"
            }
        )
        
        interest_to_current = await db.interest.find_first(
            where={
                "fromUserId": profile.userId,
                "toUserId": current_user.id,
                "status": "ACCEPTED"
            }
        )
        
        has_mutual_interest = interest_from_current is not None and interest_to_current is not None
    
    return ProfileResponse(
        id=profile.id,
        userId=profile.userId,
        name=profile.name,
        gender=profile.gender,
        age=profile.age,
        maritalStatus=profile.maritalStatus,
        motherTongue=profile.motherTongue,
        religion=profile.religion,
        caste=profile.caste,
        city=profile.city,
        state=profile.state,
        residingCountry=profile.residingCountry,
        food=profile.food,
        complexion=profile.complexion,
        bodyType=profile.bodyType,
        heightCm=profile.heightCm,
        physicalStatus=profile.physicalStatus,
        educationQualification=profile.educationQualification,
        occupation=profile.occupation,
        aboutMe=profile.aboutMe,
        approved=profile.approved,
        createdAt=profile.createdAt.isoformat(),
        photos=[{"id": p.id, "url": p.url, "isPrimary": p.isPrimary} for p in profile.photos],
        documents=[{"id": d.id, "url": d.url, "type": d.type} for d in profile.documents],
        mobileNumber=profile.mobileNumber if (not profile.hidePhoneNumber and show_phone) else ("Hidden" if profile.hidePhoneNumber else None),
        hasMutualInterest=has_mutual_interest
    )
