import asyncio
from backend.app.database import db

async def check_interests():
    await db.connect()
    
    test1 = await db.user.find_first(where={'email': 'test1@example.com'})
    test20 = await db.user.find_first(where={'email': 'test20@example.com'})
    
    if test1 and test20:
        print(f'test1 ID: {test1.id}')
        print(f'test20 ID: {test20.id}')
        
        interests = await db.interest.find_many(
            where={
                'OR': [
                    {'fromUserId': test1.id, 'toUserId': test20.id},
                    {'fromUserId': test20.id, 'toUserId': test1.id}
                ]
            }
        )
        
        print(f'Found {len(interests)} interests:')
        for interest in interests:
            print(f'  From: {interest.fromUserId} To: {interest.toUserId} Status: {interest.status}')
    else:
        print('Could not find test1 or test20 users')
    
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(check_interests())
