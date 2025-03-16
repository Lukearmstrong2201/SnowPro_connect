from fastapi import APIRouter, Depends, HTTPException, Path
from models import Users
from database import SessionLocal
from typing import Annotated, Literal
from sqlalchemy.orm import Session
from starlette import status
from pydantic import BaseModel, Field, EmailStr, constr
from datetime import date


router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()     # Notes: Contacting the database
    try: 
        yield db   # Return Database
    finally:
        db.close()  # Close connection to database


db_dependency = Annotated[Session, Depends(get_db)]     #Notes: Using dependency injection to grab and run get_db

#USER REQUEST
class UserRequest(BaseModel):
    first_name: str = Field(min_length=3)
    last_name: str = Field(min_length=2)
    email: EmailStr
    contact: str= Field(min_length=10, max_length=15) 
    address: str
    language: str
    date_of_birth: date
    role: Literal["student", "instructor"]
    

#GET USER BY ID
@router.get("/{user_id}", status_code=status.HTTP_200_OK)
async def read_user(db: db_dependency, user_id: int = Path(gt=0)):    
    user_model = db.query(Users).filter(Users.id == user_id).first()    
    if user_model:
        return user_model
    raise HTTPException(status_code=404, detail='User not found')



#CREATE USER
@router.post("/user", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, user_request: UserRequest):
    # Check if user already exists
    existing_user = db.query(Users).filter(Users.email == user_request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered") 

    user_model = Users(**user_request.model_construct())
    db.add(user_model)  # Get the database ready
    db.commit()  # Flush and commit transaction to database
    db.refresh(user_model)  # Refresh to get the ID
    return {"message": "User created successfully", "user_id": user_model.id}



#UPDATE USER
@router.put("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_user(db: db_dependency, user_request: UserRequest, user_id: int = Path(gt=0)):
    user_model = db.query(Users).filter(Users.id == user_id).first()
    if not user_model:
        raise HTTPException(status_code=404, detail='User not found.')
    
    # Update user details
    user_model.first_name = user_request.first_name
    user_model.last_name = user_request.last_name
    user_model.email = user_request.email
    user_model.contact = user_request.contact
    user_model.date_of_birth = user_request.date_of_birth
    user_model.address = user_request.address
    user_model.language = user_request.language
    user_model.role = user_request.role

    db.commit()
    return {"message": f"User with ID {user_id} has been updated."}   
    

#DELETE USER
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(db: db_dependency, user_id: int = Path(gt=0)):
    user_model = db.query(Users).filter(Users.id == user_id).first()
    if not user_model:
        raise HTTPException(status_code=404, detail="User not found.")

    db.delete(user_model)
    db.commit()
    return {"message": f"User with ID {user_id} has been deleted."}


