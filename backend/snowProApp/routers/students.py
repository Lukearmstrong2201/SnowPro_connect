
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

#Get the current logged in user
user_dependency = Annotated[Users, Depends(get_current_user)]

#GET THE LOGGED IN STUDENTS PROFILE 
@router.get("/me", response_model=StudentResponse, status_code=200)
async def get_student_profile(db: db_dependency, user: user_dependency):
   
    student = db.query(Students).join(Users).filter(Students.user_id == user.id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Return student and user data 
    return StudentResponse(
        id=student.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        contact=user.contact,
        address=user.address,
        language=user.language,
        date_of_birth=user.date_of_birth,
        role=user.role,
        is_active=user.is_active
    )


# GET any student by ID — restricted to admin or the student themself
@router.get("/{student_id}", response_model=StudentResponse, status_code=200)
async def get_student_by_id(student_id: int, db: db_dependency, user: user_dependency):
    student = db.query(Students).filter(Students.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if user.role != "admin" and student.user_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    user_data = db.query(Users).filter(Users.id == student.user_id).first()

    return StudentResponse(
        id=student.id,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        contact=user_data.contact,
        address=user_data.address,
        language=user_data.language,
        date_of_birth=user_data.date_of_birth,
        role=user_data.role,
        is_active=user_data.is_active
    )