#!/usr/bin/env python3
"""
Update admin email to aasanrishtecontact@gmail.com
"""
import asyncio
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.database import db
from backend.app.utils import hash_password
from datetime import datetime

async def update_admin_email():
    try:
        await db.connect()
        
        admin_user = await db.user.find_first(where={'role': 'ADMIN'})
        if admin_user:
            await db.user.update(
                where={'id': admin_user.id},
                data={'email': 'aasanrishtecontact@gmail.com'}
            )
            print(f'✅ Updated admin email from {admin_user.email} to aasanrishtecontact@gmail.com')
            print(f'Admin ID: {admin_user.id}')
        else:
            hashed_password = hash_password('admin123')
            new_admin = await db.user.create(
                data={
                    'email': 'aasanrishtecontact@gmail.com',
                    'passwordHash': hashed_password,
                    'role': 'ADMIN',
                    'verifiedAt': datetime.utcnow()
                }
            )
            print(f'✅ Created new admin user: aasanrishtecontact@gmail.com')
            print(f'Admin ID: {new_admin.id}')
        
        await db.disconnect()
        
    except Exception as e:
        print(f'❌ Error updating admin email: {e}')
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(update_admin_email())
