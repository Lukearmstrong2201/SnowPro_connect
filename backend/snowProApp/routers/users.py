from fastapi import APIRouter, Depends, HTTPException, Path, File, UploadFile
from models import Users
from database import SessionLocal
from typing import Annotated, Literal
from sqlalchemy.orm import Session
from starlette import status
from pydantic import BaseModel, Field, EmailStr, constr
from datetime import date
from .auth import get_current_user
from schemas.users import UserRequest, UserResponse, UserUpdate
import os
import shutil
from pathlib import Path

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()     # Notes: Contacting the database
    try: 
        yield db   # Return Database
    finally:
        db.close()  # Close connection to database


db_dependency = Annotated[Session, Depends(get_db)]     #Notes: Using dependency injection to grab and run get_db
user_dependency = Annotated[Users, Depends(get_current_user)]


#GET USER BY ID
@router.get("/{user_id}", status_code=status.HTTP_200_OK, response_model=UserResponse)
async def read_user(
    db: db_dependency,
    user: user_dependency,
    user_id: int = Path(gt=0)
): 

    if user.role != "admin" and user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
       
    user_model = db.query(Users).filter(Users.id == user_id).first()    
    if user_model:
        return user_model
    raise HTTPException(status_code=404, detail='User not found')

#PATCH USER
@router.patch("/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def update_user(
    current_user: user_dependency,
    user_update: UserUpdate,
    db: db_dependency,
    user_id: int = Path(gt=0),
    
):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    user_model = db.query(Users).filter(Users.id == user_id).first()
    if not user_model:
        raise HTTPException(status_code=404, detail="User not found")

    if user_update.first_name is not None:
        user_model.first_name = user_update.first_name
    if user_update.last_name is not None:
        user_model.last_name = user_update.last_name
    if user_update.contact is not None:
        user_model.contact = user_update.contact
    if user_update.address is not None:
        user_model.address = user_update.address
    if user_update.language is not None:
        user_model.language = user_update.language

    db.commit()
    db.refresh(user_model)

    return user_model
    

#DELETE USER
@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
async def delete_user(
    current_user: user_dependency,
    db: db_dependency,
    user_id: int = Path(gt=0),
    
):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    user_model = db.query(Users).filter(Users.id == user_id).first()
    if not user_model:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user_model)
    db.commit()

    return {"message": f"User with ID {user_id} has been deleted."}

# UPLOAD PROFILE PICTURE
UPLOAD_DIR = "static/profile_pics"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/{user_id}/upload-profile-picture", status_code=200)
async def upload_profile_picture(
    user_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[Users, Depends(get_current_user)],
    file: UploadFile = File(...)
):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Save the file to a local folder 
    upload_dir = Path("static/profile_pics")
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_path = upload_dir / f"user_{user_id}_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save the relative path to the database
    user.profile_picture = f"/static/profile_pics/{file_path.name}"

    db.commit()
    db.refresh(user)

    return {"message": "Profile picture uploaded successfully", "path": user.profile_picture}

#MAKE USER ADMIN
@router.post("/{user_id}/make-admin", status_code=200)
async def promote_to_admin(
    user_id: int,
    db: db_dependency,
    current_user: user_dependency
):

    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can promote users")

    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = "admin"
    db.commit()
    db.refresh(user)

    return {"message": f"User {user_id} promoted to admin"}



