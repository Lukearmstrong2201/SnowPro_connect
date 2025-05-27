from fastapi import APIRouter, Depends, HTTPException, Query
from models import Instructors, Users
from database import SessionLocal
from sqlalchemy.orm import Session
from .auth import get_current_user
from typing import Annotated, List
from schemas.instructors import InstructorResponse, InstructorUpdate

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
        local_resort=instructor.local_resort,
        profile_picture=user.profile_picture
    )

# GET a specific instructor by ID
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
        profile_picture=instructor_user.profile_picture
    )

# PATCH to update instructor's local resort
@router.patch("/update-local-resort", status_code=200)
async def update_local_resort(
    update_data: InstructorUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != "instructor":
        raise HTTPException(status_code=403, detail="Only instructors can update this.")

    instructor = db.query(Instructors).filter(Instructors.user_id == current_user.id).first()
    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor not found.")

    if update_data.local_resort:
        instructor.local_resort = update_data.local_resort

    db.commit()
    db.refresh(instructor)
    return {"message": "Local resort updated successfully", "local_resort": instructor.local_resort}

# GET all instructors by resort
@router.get("", response_model=List[InstructorResponse])
async def get_instructors_by_resort(
    db: db_dependency,
    resort: str = Query(..., min_length=1)
):
    instructors = db.query(Instructors).filter(Instructors.local_resort == resort.lower()).all()

    results = []
    for inst in instructors:
        user = inst.user
        results.append(InstructorResponse(
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
            certificate_body=inst.certificate_body,
            level_of_qualification=inst.level_of_qualification,
            years_of_experience=inst.years_of_experience,
            local_resort=inst.local_resort,
            profile_picture=user.profile_picture
        ))

    return results