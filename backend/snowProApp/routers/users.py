from fastapi import APIRouter, Depends, HTTPException, Path
from models import Users
from database import SessionLocal
from typing import Annotated
from sqlalchemy.orm import Session
from starlette import status
from pydantic import BaseModel, Field, EmailStr
from datetime import date

router = APIRouter()

def get_db():
    db = SessionLocal()     # Notes: Contacting the database
    try: 
        yield db   # Return Database
    finally:
        db.close()  # Close connection to database


db_dependency = Annotated[Session, Depends(get_db)]     #Notes: Using dependency injection to grab and run get_db

#USER REQUEST
class UserRequest(BaseModel):
    name: str = Field(min_length=3)
    email: EmailStr
    contact: str= Field(min_length=10, max_length=15) #Contact should be between 10 and 15 digits
    date_of_birth: date
    role: str = Field(min_length=3, max_length=50)  # Role should be between 3 and 50 characters
    
@router.get("/", status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency ):    
    return db.query(Users).all()

@router.get("/user/{user_id}", status_code=status.HTTP_200_OK)
async def read_user(db: db_dependency, user_id: int = Path(gt=0)):    # Path perameter is validation, ensuring id > 0
    user_model = db.query(Users).filter(Users.id == user_id).first()    #Notes: first() ensures a match is returned as soon as user_id is found
    if user_model is not None:
        return user_model
    raise HTTPException(status_code=404, detail='User not found') 


@router.post("/user", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, user_request: UserRequest):
    user_request.contact = str(user_request.contact)
    user_model = Users(**user_request.model_dump())
    db.add(user_model)  # Get the database ready
    db.commit() # flush and commit transaction to database
    
@router.put("/user/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_user(db: db_dependency,user_request: UserRequest, user_id: int=Path(gt=0)):
    user_model = db.query(Users).filter(Users.id == user_id).first()
    if user_model is None:
        raise HTTPException(status_code=404, detail='User not found.')
    
    user_request.contact = str(user_request.contact)
    
    user_model.name = user_request.name 
    user_model.email = user_request.email
    user_model.contact = user_request.contact
    user_model.date_of_birth = user_request.date_of_birth
    user_model.role = user_request.role

    db.add(user_model)
    db.commit()

@router.delete("/user/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(db:db_dependency, user_id: int=Path(gt=0)):
    user_model = db.query(Users).filter(Users.id == user_id).first()
    if user_model is None:
        raise HTTPException(status_code=404, detail='User not found.')
    db.query(Users).filter(Users.id == user_id).delete()

    db.commit()

