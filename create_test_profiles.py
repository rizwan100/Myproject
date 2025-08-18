import asyncio
import sys
import os
from datetime import date, datetime
from pathlib import Path

backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

from app.database import db
from app.utils import hash_password

GROOM_DATA = [
    {
        "name": "test1",
        "email": "test1@example.com",
        "age": 28,
        "city": "Hyderabad",
        "state": "Telangana",
        "occupation": "Software Engineer",
        "education": "B.Tech Computer Science",
        "height": 175,
        "complexion": "FAIR",
        "caste": "Sheikh",
        "motherTongue": "URDU"
    },
    {
        "name": "test2", 
        "email": "test2@example.com",
        "age": 30,
        "city": "Mumbai",
        "state": "Maharashtra", 
        "occupation": "Business Analyst",
        "education": "MBA",
        "height": 180,
        "complexion": "WHEATISH",
        "caste": "Syed",
        "motherTongue": "HINDI"
    },
    {
        "name": "test3",
        "email": "test3@example.com", 
        "age": 26,
        "city": "Delhi",
        "state": "Delhi",
        "occupation": "Doctor",
        "education": "MBBS",
        "height": 172,
        "complexion": "VERY_FAIR",
        "caste": "Khan",
        "motherTongue": "URDU"
    },
    {
        "name": "test4",
        "email": "test4@example.com",
        "age": 32,
        "city": "Bangalore",
        "state": "Karnataka",
        "occupation": "Marketing Manager", 
        "education": "B.Com",
        "height": 178,
        "complexion": "WHEATISH_BROWN",
        "caste": "Ansari",
        "motherTongue": "ENGLISH"
    },
    {
        "name": "test5",
        "email": "test5@example.com",
        "age": 29,
        "city": "Chennai",
        "state": "Tamil Nadu",
        "occupation": "Civil Engineer",
        "education": "B.Tech Civil",
        "height": 176,
        "complexion": "DARK",
        "caste": "Pathan",
        "motherTongue": "TAMIL"
    },
    {
        "name": "test6",
        "email": "test6@example.com",
        "age": 27,
        "city": "Pune",
        "state": "Maharashtra",
        "occupation": "Teacher",
        "education": "M.Ed",
        "height": 174,
        "complexion": "FAIR",
        "caste": "Malik",
        "motherTongue": "HINDI"
    },
    {
        "name": "test7",
        "email": "test7@example.com",
        "age": 31,
        "city": "Kolkata",
        "state": "West Bengal",
        "occupation": "Chartered Accountant",
        "education": "CA",
        "height": 177,
        "complexion": "WHEATISH",
        "caste": "Sheikh",
        "motherTongue": "URDU"
    },
    {
        "name": "test8",
        "email": "test8@example.com",
        "age": 25,
        "city": "Ahmedabad",
        "state": "Gujarat",
        "occupation": "Pharmacist",
        "education": "B.Pharm",
        "height": 173,
        "complexion": "VERY_FAIR",
        "caste": "Syed",
        "motherTongue": "HINDI"
    },
    {
        "name": "test9",
        "email": "test9@example.com",
        "age": 33,
        "city": "Lucknow",
        "state": "Uttar Pradesh",
        "occupation": "Government Officer",
        "education": "M.A Political Science",
        "height": 179,
        "complexion": "WHEATISH_BROWN",
        "caste": "Khan",
        "motherTongue": "URDU"
    },
    {
        "name": "test10",
        "email": "test10@example.com",
        "age": 28,
        "city": "Jaipur",
        "state": "Rajasthan",
        "occupation": "Architect",
        "education": "B.Arch",
        "height": 175,
        "complexion": "FAIR",
        "caste": "Ansari",
        "motherTongue": "HINDI"
    }
]

BRIDE_DATA = [
    {
        "name": "test11",
        "email": "test11@example.com",
        "age": 24,
        "city": "Hyderabad",
        "state": "Telangana",
        "occupation": "Software Developer",
        "education": "B.Tech IT",
        "height": 160,
        "complexion": "FAIR",
        "caste": "Sheikh",
        "motherTongue": "URDU"
    },
    {
        "name": "test12",
        "email": "test12@example.com",
        "age": 26,
        "city": "Mumbai",
        "state": "Maharashtra",
        "occupation": "Nurse",
        "education": "B.Sc Nursing",
        "height": 158,
        "complexion": "WHEATISH",
        "caste": "Syed",
        "motherTongue": "HINDI"
    },
    {
        "name": "test13",
        "email": "test13@example.com",
        "age": 23,
        "city": "Delhi",
        "state": "Delhi",
        "occupation": "Teacher",
        "education": "B.Ed",
        "height": 162,
        "complexion": "VERY_FAIR",
        "caste": "Khan",
        "motherTongue": "URDU"
    },
    {
        "name": "test14",
        "email": "test14@example.com",
        "age": 28,
        "city": "Bangalore",
        "state": "Karnataka",
        "occupation": "HR Manager",
        "education": "MBA HR",
        "height": 165,
        "complexion": "WHEATISH_BROWN",
        "caste": "Ansari",
        "motherTongue": "ENGLISH"
    },
    {
        "name": "test15",
        "email": "test15@example.com",
        "age": 25,
        "city": "Chennai",
        "state": "Tamil Nadu",
        "occupation": "Physiotherapist",
        "education": "BPT",
        "height": 159,
        "complexion": "DARK",
        "caste": "Pathan",
        "motherTongue": "TAMIL"
    },
    {
        "name": "test16",
        "email": "test16@example.com",
        "age": 24,
        "city": "Pune",
        "state": "Maharashtra",
        "occupation": "Graphic Designer",
        "education": "B.Des",
        "height": 161,
        "complexion": "FAIR",
        "caste": "Malik",
        "motherTongue": "HINDI"
    },
    {
        "name": "test17",
        "email": "test17@example.com",
        "age": 27,
        "city": "Kolkata",
        "state": "West Bengal",
        "occupation": "Bank Officer",
        "education": "B.Com",
        "height": 163,
        "complexion": "WHEATISH",
        "caste": "Sheikh",
        "motherTongue": "URDU"
    },
    {
        "name": "test18",
        "email": "test18@example.com",
        "age": 22,
        "city": "Ahmedabad",
        "state": "Gujarat",
        "occupation": "Fashion Designer",
        "education": "NIFT",
        "height": 157,
        "complexion": "VERY_FAIR",
        "caste": "Syed",
        "motherTongue": "HINDI"
    },
    {
        "name": "test19",
        "email": "test19@example.com",
        "age": 29,
        "city": "Lucknow",
        "state": "Uttar Pradesh",
        "occupation": "Lawyer",
        "education": "LLB",
        "height": 164,
        "complexion": "WHEATISH_BROWN",
        "caste": "Khan",
        "motherTongue": "URDU"
    },
    {
        "name": "test20",
        "email": "test20@example.com",
        "age": 26,
        "city": "Jaipur",
        "state": "Rajasthan",
        "occupation": "Interior Designer",
        "education": "B.Arch Interior",
        "height": 160,
        "complexion": "FAIR",
        "caste": "Ansari",
        "motherTongue": "HINDI"
    }
]

def calculate_age(birth_date: date) -> int:
    today = date.today()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

def get_birth_date(age: int) -> datetime:
    """Calculate birth date from age"""
    today = date.today()
    birth_date = date(today.year - age, today.month, today.day)
    return datetime.combine(birth_date, datetime.min.time())

async def create_test_user_and_profile(user_data: dict, gender: str):
    """Create a test user and their profile"""
    try:
        existing_user = await db.user.find_unique(where={"email": user_data["email"]})
        if existing_user:
            existing_profile = await db.profile.find_unique(where={"userId": existing_user.id})
            if existing_profile:
                print(f"Profile for {user_data['email']} already exists, skipping...")
                return
            else:
                print(f"User {user_data['email']} exists but no profile found, creating profile...")
                user = existing_user
        else:
            hashed_password = hash_password("test123")  # Default password for all test users
            user = await db.user.create(
                data={
                    "email": user_data["email"],
                    "passwordHash": hashed_password,
                    "role": "USER",
                    "verifiedAt": datetime.now()  # Pre-verify test users
                }
            )
            print(f"Created new user: {user_data['email']}")
        
        birth_date = get_birth_date(user_data["age"])
        
        profile = await db.profile.create(
            data={
                "userId": user.id,
                "createdBy": "SELF",
                "name": user_data["name"],
                "gender": gender,
                "dob": birth_date,
                "age": user_data["age"],
                "maritalStatus": "NEVER_MARRIED",
                "noOfChildren": 0,
                "childrenLivingStatus": "NOT_APPLICABLE",
                "motherTongue": user_data["motherTongue"],
                "religion": "Islam",
                "caste": user_data["caste"],
                "citizenship": "Indian",
                "residingCountry": "INDIA",
                "state": user_data["state"],
                "city": user_data["city"],
                "countryCode": "+91",
                "landline": None,
                "mobileNumber": f"9876543{str(user_data['name'][-2:]).zfill(2)}",  # Generate fake mobile
                "food": "NON_VEGETARIAN",
                "complexion": user_data["complexion"],
                "bodyType": "AVERAGE",
                "heightCm": user_data["height"],
                "weightKg": 65 if gender == "BRIDE" else 75,
                "physicalStatus": "NORMAL",
                "bloodGroup": "B+",
                "educationQualification": user_data["education"],
                "occupation": user_data["occupation"],
                "employmentType": "PRIVATE",
                "annualIncomeCurrency": "INR",
                "annualIncome": 500000,
                "aboutMe": f"I am {user_data['name']}, a {user_data['age']} year old {user_data['occupation']} from {user_data['city']}. Looking for a life partner who shares similar values and interests.",
                "approved": True,  # Auto-approve test profiles
                "visibilityGenderRule": True
            }
        )
        
        print(f"✅ Created {gender.lower()} profile: {user_data['name']} ({user_data['email']})")
        return profile
        
    except Exception as e:
        print(f"❌ Error creating profile for {user_data['name']}: {str(e)}")
        return None

async def main():
    """Main function to create all test profiles"""
    print("🚀 Starting test profile creation...")
    
    try:
        await db.connect()
        print("✅ Connected to database")
        
        print("\n📝 Creating groom profiles...")
        for groom_data in GROOM_DATA:
            await create_test_user_and_profile(groom_data, "GROOM")
        
        print("\n👰 Creating bride profiles...")
        for bride_data in BRIDE_DATA:
            await create_test_user_and_profile(bride_data, "BRIDE")
        
        print("\n🎉 Test profile creation completed!")
        print("📊 Summary:")
        print("   - 10 Groom profiles created (test1-test10)")
        print("   - 10 Bride profiles created (test11-test20)")
        print("   - All profiles are pre-approved and verified")
        print("   - Default password for all test users: 'test123'")
        
    except Exception as e:
        print(f"❌ Error during profile creation: {str(e)}")
    finally:
        await db.disconnect()
        print("✅ Disconnected from database")

if __name__ == "__main__":
    asyncio.run(main())
