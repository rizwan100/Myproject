#!/usr/bin/env python3
"""
Script to create the first admin user for Aasan Rishte matrimonial app.
Run this script to create an initial admin account.
"""

import asyncio
import os
import sys
from datetime import datetime
from getpass import getpass

sys.path.append('/home/ubuntu/matrimonial-app/backend')

from app.database import db
from app.utils import hash_password

async def create_admin_user():
    """Create an admin user interactively"""
    print("=== Aasan Rishte Admin User Creation ===")
    print()
    
    email = input("Enter admin email: ").strip()
    if not email:
        print("Email is required!")
        return
    
    password = getpass("Enter admin password: ").strip()
    if len(password) < 6:
        print("Password must be at least 6 characters!")
        return
    
    confirm_password = getpass("Confirm admin password: ").strip()
    if password != confirm_password:
        print("Passwords do not match!")
        return
    
    try:
        await db.connect()
        
        existing_user = await db.user.find_unique(where={"email": email})
        if existing_user:
            print(f"User with email {email} already exists!")
            return
        
        hashed_password = hash_password(password)
        admin_user = await db.user.create(
            data={
                "email": email,
                "passwordHash": hashed_password,
                "role": "ADMIN",
                "verifiedAt": datetime.utcnow()
            }
        )
        
        print(f"✅ Admin user created successfully!")
        print(f"Email: {admin_user.email}")
        print(f"ID: {admin_user.id}")
        print(f"Role: {admin_user.role}")
        print()
        print("You can now log in to the admin panel using these credentials.")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
    finally:
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(create_admin_user())
