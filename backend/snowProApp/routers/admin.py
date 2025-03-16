from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Users
from .auth import get_current_user
from passlib.context import CryptContext

router = APIRouter(prefix="/admin", tags=["Admin"])

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Depends(get_db)
admin_dependency = Depends(get_current_user)

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Ensure the user making the request is an admin
def admin_required(user: Users):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required.")
    
#GET ALL USERS
@router.get("/users", status_code=200)
async def get_all_users(
    db: Session = db_dependency, 
    current_user: Users = admin_dependency
):
    # Ensure requester is an admin
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only an admin can view all users.")

    # Fetch all users from the database
    users = db.query(Users).all()

    # Return user details (excluding hashed passwords)
    return [
        {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active
        }
        for user in users
    ]

#GET ALL INSTRUCTORS 
@router.get("/instructors", status_code=200)
async def get_instructors(db: Session = db_dependency, current_user: Users = admin_dependency):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only an admin can view instructors.")
    
    instructors = db.query(Users).filter(Users.role == "instructor").all()
    return instructors

#VIEW SUSPENDED USERS
@router.get("/suspended-users", status_code=200)
async def get_suspended_users(db: Session = db_dependency, current_user: Users = admin_dependency):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only an admin can view suspended users.")
    
    suspended_users = db.query(Users).filter(Users.is_active == False).all()
    return suspended_users

#CHANGE PASSWORD OF USER
@router.put("/users/{user_id}/change-password", status_code=200)
async def change_user_password(user_id: int, password_details: dict, db: Session = db_dependency, current_user: Users = admin_dependency):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only an admin can change a user's password.")
    
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    user.hashed_password = bcrypt_context.hash(password_details['new_password'])
    db.commit()
    
    return {"message": f"Password for user with ID {user_id} has been updated."}

#SUSPEND A USER
@router.put("/users/{user_id}/suspend", status_code=200)
async def suspend_user(user_id: int, db: Session = db_dependency, current_user: Users = admin_dependency):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only an admin can suspend a user.")
    
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    user.is_active = False
    db.commit()
    
    return {"message": f"User with ID {user_id} has been suspended."}

#REACTIVATE A SUSPENDED USER
@router.put("/users/{user_id}/unsuspend", status_code=200)
async def unsuspend_user(user_id: int, db: Session = db_dependency, current_user: Users = admin_dependency):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only an admin can unsuspend a user.")
    
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    user.is_active = True
    db.commit()
    
    return {"message": f"User with ID {user_id} has been unsuspended."}

#PROMOTE USER TO ADMIN
@router.put("/promote/{user_id}", status_code=200)
async def promote_user_to_admin(
    user_id: int, 
    db: Session = db_dependency, 
    current_user: Users = admin_dependency
):
    # Ensure the requester is an admin
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only an admin can promote a user to admin.")
    
    # Find the user to be promoted
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    # Ensure the user is active
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Cannot promote an inactive user.")

    # Promote the user to admin
    user.role = "admin"
    db.commit()

    return {"message": f"User {user.first_name} {user.last_name} is now an admin."}


#REMOVE ADMIN FROM USER
@router.put("/deactivate/{user_id}", status_code=200)
async def deactivate_user(user_id: int, db: Session = db_dependency, current_user: Users = admin_dependency):
    # Ensure the requester is an admin
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only an admin can deactivate a user.")

    # Find the user to deactivate
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    # Deactivate the user and reset role to 'user'
    user.is_active = False
    user.role = "user"  # Reset the role to "user" or any default role
    db.commit()

    return {"message": f"User with ID {user_id} has been deactivated and role reset to 'user'."}