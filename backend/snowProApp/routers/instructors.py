from fastapi import APIRouter, Depends, HTTPException
from models import Instructors, Users
from database import SessionLocal
from sqlalchemy.orm import Session
from .auth import get_current_user
from typing import Annotated
from schemas.instructors import InstructorResponse

router = APIRouter(prefix="/instructors", tags=["Instructors"])  

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[Users, Depends(get_current_user)]

# GET the currently authenticated instructor's profile
@router.get("/me", response_model=InstructorResponse)
async def get_own_instructor_profile(db: db_dependency, user: user_dependency):

    instructor = db.query(Instructors).filter(Instructors.user_id == user.id).first()

    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor profile not found")

    return InstructorResponse(
        id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        contact=user.contact,
        address=user.address,
        language=user.language,
        date_of_birth=user.date_of_birth,
        role=user.role,
        is_active=user.is_active,
        certificate_body=instructor.certificate_body,
        level_of_qualification=instructor.level_of_qualification,
        years_of_experience=instructor.years_of_experience,
    )


@router.get("/{instructor_id}", status_code=200)
async def get_instructor(instructor_id: int, db: db_dependency, user: user_dependency):

    instructor = db.query(Instructors).filter(Instructors.id == instructor_id).first()
    
    if user.role != "admin" and instructor.user_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor not found")

    # Fetch the associated user for name details
    instructor_user = instructor.user 

    return InstructorResponse(
        id=instructor_user.id,
        first_name=instructor_user.first_name,
        last_name=instructor_user.last_name,
        email=instructor_user.email,
        contact=instructor_user.contact,
        address=instructor_user.address,
        language=instructor_user.language,
        date_of_birth=instructor_user.date_of_birth,
        role=instructor_user.role,
        is_active=instructor_user.is_active,
        certificate_body=instructor.certificate_body,
        level_of_qualification=instructor.level_of_qualification,
        years_of_experience=instructor.years_of_experience,
    )
