
from fastapi import APIRouter, Depends, HTTPException
from models import Students, Users
from database import SessionLocal
from sqlalchemy.orm import Session
from typing import Annotated
from .auth import get_current_user
from pydantic import BaseModel, Field
from schemas.students import StudentResponse

router = APIRouter(prefix="/students", tags=["Students"]) 

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

#Gets the current logged in user
user_dependency = Annotated[Users, Depends(get_current_user)]

#GET THE LOGGED IN STUDENTS PROFILE (NEEDS DEBUGGING)
@router.get("/me", response_model=StudentResponse, status_code=200)
async def get_student_profile(db: db_dependency, user: user_dependency):
   
    student = db.query(Students).join(Users).filter(Students.user_id == user.id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Return student and user data 
    return StudentResponse(
        id=student.id,
        first_name=student.user.first_name,
        last_name=student.user.last_name,
        email=student.user.email,
        contact=student.user.contact,
        address=student.user.address,
        language=student.user.language,
        date_of_birth=student.user.date_of_birth,
        role=student.user.role,
        is_active=student.user.is_active
    )
