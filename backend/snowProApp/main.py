# Main file is the root folder where i create the fastApi application
print("main.py has been loaded with the updated routes")


from fastapi import FastAPI, Depends, HTTPException, Path
import models
from models import Users
from database import engine, SessionLocal
from typing import Annotated
from sqlalchemy.orm import Session
from starlette import status
from pydantic import BaseModel, Field, EmailStr
from datetime import date, datetime, timezone

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

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
    contact: int = Field(min_length=10, max_length=15) #Contact should be between 10 and 15 digits
    date_of_birth: date
    role: str = Field(min_length=3, max_length=50)  # Role should be between 3 and 50 characters
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))    # Default to current UTC datetime if not provided

@app.get("/", status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency ):    
    return db.query(Users).all()

@app.get("/user/{user_id}", status_code=status.HTTP_200_OK)
async def read_user(db: db_dependency, user_id: int = Path(gt=0)):    # Path perameter is validation, ensuring id > 0
    user_model = db.query(Users).filter(Users.id == user_id).first()    #Notes: first() ensures a match is returned as soon as user_id is found
    if user_model is not None:
        return user_model
    raise HTTPException(status_code=404, detail='User not found') 


@app.post("/user", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, user_request: UserRequest):
    user_model = Users(**user_request.model_dump())
    db.add(user_model)  # Get the database ready
    db.commit() # flush and commit transaction to database
    
