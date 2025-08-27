# In your database models file (e.g., models.py)
import datetime
from sqlalchemy import Column, String, DateTime

# ... inside your User model class
class User:
    # ... other fields
    reset_password_token: Column(String, nullable=True)
    reset_password_token_expires_at: Column(DateTime, nullable=True)
