from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import db
from app.auth import router as auth_router
from app.profiles import router as profiles_router
from app.interests import router as interests_router
from app.chat import router as chat_router
from app.uploads import router as uploads_router
from app.admin import router as admin_router
from datetime import datetime
import os
import uvicorn


origins = [
    "https://frontend-228802607375.asia-south1.run.app"
]
@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()

app = FastAPI(lifespan=lifespan)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


app.include_router(auth_router)
app.include_router(profiles_router)
app.include_router(interests_router)
app.include_router(chat_router)
app.include_router(uploads_router)
app.include_router(admin_router)

@app.get("/")
async def read_root():
    return {"message": "Matrimonial API", "status": "running"}

@app.get("/ping")
def ping():
    return {"status": "ok"}   

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
