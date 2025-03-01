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
    contact: str= Field(min_length=10, max_length=15) #Contact should be between 10 and 15 digits
    address: str
    language: str
    date_of_birth: date
    role: Literal["student", "instructor"]
    
@router.get("/", status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency ):    
    return db.query(Users).all()

@router.get("/{user_id}", status_code=status.HTTP_200_OK)
async def read_user(db: db_dependency, user_id: int = Path(gt=0)):    # Path parameter is validation, ensuring id > 0
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
    
@router.put("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_user(db: db_dependency,user_request: UserRequest, user_id: int=Path(gt=0)):
    user_model = db.query(Users).filter(Users.id == user_id).first()
    if user_model is None:
        raise HTTPException(status_code=404, detail='User not found.')
    
    user_request.contact = str(user_request.contact)
    
    user_model.first_name = user_request.first_name
    user_model.last_name = user_request.last_name
    user_model.email = user_request.email
    user_model.contact = user_request.contact
    user_model.date_of_birth = user_request.date_of_birth
    user_model.address = user_request.address
    user_model.language = user_request.language
    user_model.role = user_request.role

    db.commit()

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(db: db_dependency, user_id: int = Path(gt=0)):
    user_model = db.query(Users).filter(Users.id == user_id).first()
    if user_model is None:
        raise HTTPException(status_code=404, detail="User not found.")

    db.delete(user_model)
    db.commit()

