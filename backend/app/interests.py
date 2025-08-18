from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from prisma import Prisma
from app.database import db
from app.auth_utils import get_current_user
from typing import List

router = APIRouter(prefix="/interests", tags=["interests"])

class InterestCreate(BaseModel):
    toUserId: str

class InterestResponse(BaseModel):
    id: str
    fromUserId: str
    toUserId: str
    status: str
    createdAt: str
    fromProfile: dict = {}
    toProfile: dict = {}

@router.post("/", response_model=InterestResponse)
async def send_interest(interest_data: InterestCreate, current_user = Depends(get_current_user)):
    target_user = await db.user.find_unique(
        where={"id": interest_data.toUserId},
        include={"profile": True}
    )
    
    if not target_user or not target_user.profile:
        raise HTTPException(status_code=404, detail="Target user or profile not found")
    
    user_profile = await db.profile.find_unique(where={"userId": current_user.id})
    if not user_profile:
        raise HTTPException(status_code=400, detail="Please create your profile first")
    
    if user_profile.gender == target_user.profile.gender:
        raise HTTPException(status_code=403, detail="Cannot send interest to same gender")
    
    existing_interest = await db.interest.find_unique(
        where={"fromUserId_toUserId": {"fromUserId": current_user.id, "toUserId": interest_data.toUserId}}
    )
    
    if existing_interest:
        raise HTTPException(status_code=400, detail="Interest already sent")
    
    reverse_interest = await db.interest.find_unique(
        where={"fromUserId_toUserId": {"fromUserId": interest_data.toUserId, "toUserId": current_user.id}}
    )
    
    print(f"DEBUG: Looking for reverse interest from {interest_data.toUserId} to {current_user.id}")
    print(f"DEBUG: Found reverse interest: {reverse_interest}")
    if reverse_interest:
        print(f"DEBUG: Reverse interest status: {reverse_interest.status}")
    
    if reverse_interest and reverse_interest.status == "PENDING":
        print(f"DEBUG: Mutual interest detected! Updating both interests to ACCEPTED")
        
        await db.interest.update(
            where={"id": reverse_interest.id},
            data={"status": "ACCEPTED"}
        )
        
        interest = await db.interest.create(
            data={
                "fromUserId": current_user.id,
                "toUserId": interest_data.toUserId,
                "status": "ACCEPTED"
            },
            include={
                "fromUser": {"include": {"profile": True}},
                "toUser": {"include": {"profile": True}}
            }
        )
        
        print(f"DEBUG: Created new interest with ACCEPTED status: {interest.id}")
        
        existing_conversation = await db.conversation.find_first(
            where={
                "OR": [
                    {"aUserId": current_user.id, "bUserId": interest_data.toUserId},
                    {"aUserId": interest_data.toUserId, "bUserId": current_user.id}
                ]
            }
        )
        
        if not existing_conversation:
            conversation = await db.conversation.create(
                data={
                    "aUserId": current_user.id,
                    "bUserId": interest_data.toUserId
                }
            )
            print(f"DEBUG: Created conversation: {conversation.id}")
        else:
            print(f"DEBUG: Conversation already exists: {existing_conversation.id}")
    else:
        print(f"DEBUG: No mutual interest detected, creating PENDING interest")
        interest = await db.interest.create(
            data={
                "fromUserId": current_user.id,
                "toUserId": interest_data.toUserId,
                "status": "PENDING"
            },
            include={
                "fromUser": {"include": {"profile": True}},
                "toUser": {"include": {"profile": True}}
            }
        )
    
    return InterestResponse(
        id=interest.id,
        fromUserId=interest.fromUserId,
        toUserId=interest.toUserId,
        status=interest.status,
        createdAt=interest.createdAt.isoformat(),
        fromProfile={
            "id": interest.fromUser.profile.id if interest.fromUser.profile else "",
            "name": interest.fromUser.profile.name if interest.fromUser.profile else "",
            "age": interest.fromUser.profile.age if interest.fromUser.profile else 0,
            "city": interest.fromUser.profile.city if interest.fromUser.profile else ""
        },
        toProfile={
            "id": interest.toUser.profile.id if interest.toUser.profile else "",
            "name": interest.toUser.profile.name if interest.toUser.profile else "",
            "age": interest.toUser.profile.age if interest.toUser.profile else 0,
            "city": interest.toUser.profile.city if interest.toUser.profile else ""
        }
    )

@router.patch("/{interest_id}")
async def update_interest(interest_id: str, status: str, current_user = Depends(get_current_user)):
    if status not in ["ACCEPTED", "REJECTED", "BLOCKED"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    interest = await db.interest.find_unique(where={"id": interest_id})
    if not interest:
        raise HTTPException(status_code=404, detail="Interest not found")
    
    if interest.toUserId != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this interest")
    
    updated_interest = await db.interest.update(
        where={"id": interest_id},
        data={"status": status}
    )
    
    if status == "ACCEPTED":
        existing_conversation = await db.conversation.find_first(
            where={
                "OR": [
                    {"aUserId": interest.fromUserId, "bUserId": interest.toUserId},
                    {"aUserId": interest.toUserId, "bUserId": interest.fromUserId}
                ]
            }
        )
        
        if not existing_conversation:
            await db.conversation.create(
                data={
                    "aUserId": interest.fromUserId,
                    "bUserId": interest.toUserId
                }
            )
    
    return {"message": f"Interest {status.lower()}", "status": updated_interest.status}

@router.get("/proposals")
async def get_proposals(current_user = Depends(get_current_user)):
    user_profile = await db.profile.find_unique(where={"userId": current_user.id})
    if not user_profile:
        raise HTTPException(status_code=400, detail="Please create your profile first")
    
    target_gender = "GROOM" if user_profile.gender == "BRIDE" else "BRIDE"
    
    matches = await db.profile.find_many(
        where={
            "gender": target_gender,
            "approved": True,
            "visibilityGenderRule": True
        },
        include={"photos": True, "user": True},
        take=10,
        order={"createdAt": "desc"}
    )
    
    received_interests = await db.interest.find_many(
        where={"toUserId": current_user.id, "status": "PENDING"},
        include={
            "fromUser": {"include": {"profile": {"include": {"photos": True}}}}
        }
    )
    
    sent_interests = await db.interest.find_many(
        where={"fromUserId": current_user.id},
        include={
            "toUser": {"include": {"profile": {"include": {"photos": True}}}}
        }
    )
    
    return {
        "matches": [
            {
                "id": profile.id,
                "name": profile.name,
                "age": profile.age,
                "city": profile.city,
                "occupation": profile.occupation,
                "photos": [{"url": p.url, "isPrimary": p.isPrimary} for p in profile.photos]
            }
            for profile in matches
        ],
        "receivedInterests": [
            {
                "interestId": interest.id,
                "profile": {
                    "id": interest.fromUser.profile.id if interest.fromUser.profile else "",
                    "name": interest.fromUser.profile.name if interest.fromUser.profile else "",
                    "age": interest.fromUser.profile.age if interest.fromUser.profile else 0,
                    "city": interest.fromUser.profile.city if interest.fromUser.profile else "",
                    "occupation": interest.fromUser.profile.occupation if interest.fromUser.profile else "",
                    "photos": [{"url": p.url, "isPrimary": p.isPrimary} for p in interest.fromUser.profile.photos] if interest.fromUser.profile else []
                },
                "createdAt": interest.createdAt.isoformat()
            }
            for interest in received_interests
        ],
        "sentInterests": [
            {
                "interestId": interest.id,
                "status": interest.status,
                "profile": {
                    "id": interest.toUser.profile.id if interest.toUser.profile else "",
                    "name": interest.toUser.profile.name if interest.toUser.profile else "",
                    "age": interest.toUser.profile.age if interest.toUser.profile else 0,
                    "city": interest.toUser.profile.city if interest.toUser.profile else "",
                    "occupation": interest.toUser.profile.occupation if interest.toUser.profile else "",
                    "photos": [{"url": p.url, "isPrimary": p.isPrimary} for p in interest.toUser.profile.photos] if interest.toUser.profile else []
                },
                "createdAt": interest.createdAt.isoformat()
            }
            for interest in sent_interests
        ]
    }
