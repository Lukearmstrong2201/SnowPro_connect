from fastapi import APIRouter, Depends, HTTPException, Path
from models import Users
from database import SessionLocal
from typing import Annotated, Literal
from sqlalchemy.orm import Session
from starlette import status
from pydantic import BaseModel, Field, EmailStr, constr
from datetime import date
from .auth import get_current_user
from schemas.users import UserRequest, UserResponse

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

#UPDATE USER
@router.put("/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def update_user(
    current_user: user_dependency,
    user_request: UserRequest,
    db: db_dependency,
    user_id: int = Path(gt=0),
    
):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")

    user_model = db.query(Users).filter(Users.id == user_id).first()
    if not user_model:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent non-admins from updating their own role
    if current_user.role != "admin":
        user_request.role = user_model.role

    # Update fields
    user_model.first_name = user_request.first_name
    user_model.last_name = user_request.last_name
    user_model.email = user_request.email
    user_model.contact = user_request.contact
    user_model.address = user_request.address
    user_model.language = user_request.language
    user_model.date_of_birth = user_request.date_of_birth
    user_model.role = user_request.role

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


