from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from prisma import Prisma
from app.database import db
from app.auth_utils import get_current_user
from typing import List, Dict, Optional
import json
from datetime import datetime

router = APIRouter(prefix="/chat", tags=["chat"])

class MessageCreate(BaseModel):
    conversationId: str
    text: str

class MessageResponse(BaseModel):
    id: str
    conversationId: str
    senderId: str
    text: str
    createdAt: str
    readAt: Optional[str] = None

class ConversationResponse(BaseModel):
    id: str
    aUserId: str
    bUserId: str
    createdAt: str
    otherUser: dict
    lastMessage: Optional[dict] = None

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data.get("type") == "message":
                conversation_id = message_data.get("conversationId")
                text = message_data.get("text")
                
                conversation = await db.conversation.find_unique(
                    where={"id": conversation_id}
                )
                
                if conversation and (conversation.aUserId == user_id or conversation.bUserId == user_id):
                    message = await db.message.create(
                        data={
                            "conversationId": conversation_id,
                            "senderId": user_id,
                            "text": text
                        }
                    )
                    
                    other_user_id = conversation.bUserId if conversation.aUserId == user_id else conversation.aUserId
                    await manager.send_personal_message(
                        json.dumps({
                            "type": "message",
                            "messageId": message.id,
                            "conversationId": conversation_id,
                            "senderId": user_id,
                            "text": text,
                            "createdAt": message.createdAt.isoformat()
                        }),
                        other_user_id
                    )
                    
    except WebSocketDisconnect:
        manager.disconnect(user_id)

@router.get("/conversations", response_model=List[ConversationResponse])
async def get_conversations(current_user = Depends(get_current_user)):
    conversations = await db.conversation.find_many(
        where={
            "OR": [
                {"aUserId": current_user.id},
                {"bUserId": current_user.id}
            ]
        },
        include={
            "userA": {"include": {"profile": True}},
            "userB": {"include": {"profile": True}},
            "messages": {
                "take": 1,
                "orderBy": {"createdAt": "desc"}
            }
        },
        order={"createdAt": "desc"}
    )
    
    result = []
    for conv in conversations:
        other_user = conv.userB if conv.aUserId == current_user.id else conv.userA
        last_message = conv.messages[0] if conv.messages else None
        
        result.append(ConversationResponse(
            id=conv.id,
            aUserId=conv.aUserId,
            bUserId=conv.bUserId,
            createdAt=conv.createdAt.isoformat(),
            otherUser={
                "id": other_user.id,
                "name": other_user.profile.name if other_user.profile else "",
                "age": other_user.profile.age if other_user.profile else 0,
                "city": other_user.profile.city if other_user.profile else ""
            },
            lastMessage={
                "text": last_message.text,
                "createdAt": last_message.createdAt.isoformat(),
                "senderId": last_message.senderId
            } if last_message else None
        ))
    
    return result

@router.get("/messages")
async def get_messages(conversationId: str, current_user = Depends(get_current_user)):
    conversation = await db.conversation.find_unique(
        where={"id": conversationId}
    )
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if conversation.aUserId != current_user.id and conversation.bUserId != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    mutual_interest = await db.interest.find_first(
        where={
            "OR": [
                {"fromUserId": conversation.aUserId, "toUserId": conversation.bUserId, "status": "ACCEPTED"},
                {"fromUserId": conversation.bUserId, "toUserId": conversation.aUserId, "status": "ACCEPTED"}
            ]
        }
    )
    
    if not mutual_interest:
        raise HTTPException(status_code=403, detail="Chat requires mutual interest")
    
    messages = await db.message.find_many(
        where={"conversationId": conversationId},
        order={"createdAt": "asc"}
    )
    
    return [
        MessageResponse(
            id=msg.id,
            conversationId=msg.conversationId,
            senderId=msg.senderId,
            text=msg.text,
            createdAt=msg.createdAt.isoformat(),
            readAt=msg.readAt.isoformat() if msg.readAt else None
        )
        for msg in messages
    ]

@router.post("/messages", response_model=MessageResponse)
async def send_message(message_data: MessageCreate, current_user = Depends(get_current_user)):
    conversation = await db.conversation.find_unique(
        where={"id": message_data.conversationId}
    )
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if conversation.aUserId != current_user.id and conversation.bUserId != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    mutual_interest = await db.interest.find_first(
        where={
            "OR": [
                {"fromUserId": conversation.aUserId, "toUserId": conversation.bUserId, "status": "ACCEPTED"},
                {"fromUserId": conversation.bUserId, "toUserId": conversation.aUserId, "status": "ACCEPTED"}
            ]
        }
    )
    
    if not mutual_interest:
        raise HTTPException(status_code=403, detail="Chat requires mutual interest")
    
    message = await db.message.create(
        data={
            "conversationId": message_data.conversationId,
            "senderId": current_user.id,
            "text": message_data.text
        }
    )
    
    return MessageResponse(
        id=message.id,
        conversationId=message.conversationId,
        senderId=message.senderId,
        text=message.text,
        createdAt=message.createdAt.isoformat()
    )
