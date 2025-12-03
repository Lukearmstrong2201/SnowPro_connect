from fastapi import APIRouter, Depends, HTTPException, Query
from models import Instructors, Users, InstructorAvailability, BookedSlot
from database import SessionLocal
from sqlalchemy.orm import Session
from .auth import get_current_user
from typing import Annotated, List
from schemas.instructors import InstructorResponse, InstructorUpdate
from schemas.availability import AvailabilityRequest, AvailabilitySlot, InstructorAvailabilityResponse
from datetime import date, datetime
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError


router = APIRouter(prefix="/instructors", tags=["Instructors"])  

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency to get the current authenticated user
db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[Users, Depends(get_current_user)]

# GET the currently authenticated instructor's profile
@router.get("/me", response_model=InstructorResponse)
async def get_own_instructor_profile(db: db_dependency, user: user_dependency):
    instructor = db.query(Instructors).filter(Instructors.user_id == user.id).first()

    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor profile not found")

    return InstructorResponse(
        id=instructor.id,
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
        profile_picture=user.profile_picture,
        hourly_rate=instructor.hourly_rate
    )


# GET the instructor's hourly rate
@router.get("/hourly-rate")
def get_hourly_rate(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Must be an instructor
    if current_user.role != "instructor":
        raise HTTPException(status_code=403, detail="Only instructors can access this.")

    # Get instructor row via user_id 
    instructor = (
        db.query(Instructors)
        .filter(Instructors.user_id == current_user.id)
        .first()
    )

    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor profile not found.")

    return {instructor.hourly_rate}


@router.patch("/update-hourly-rate")
async def update_hourly_rate(
    data: InstructorUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != "instructor":
        raise HTTPException(status_code=403, detail="Only instructors can update this.")

    instructor = (
        db.query(Instructors)
        .filter(Instructors.user_id == current_user.id)
        .first()
    )

    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor not found.")

    if data.hourly_rate is None:
        raise HTTPException(status_code=400, detail="hourly_rate is required.")

    instructor.hourly_rate = data.hourly_rate

    db.commit()
    db.refresh(instructor)

    return {instructor.hourly_rate}



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

# POST to set instructor availability
@router.post("/{instructor_id}/set-availability", response_model=List[InstructorAvailabilityResponse])
async def set_availability(
    instructor_id: int,
    availability: List[AvailabilitySlot],
    db: Session = Depends(get_db)
):
    try:
        # Delete existing availability for this instructor
        db.query(InstructorAvailability).filter(
            InstructorAvailability.instructor_id == instructor_id
        ).delete(synchronize_session=False)
        db.commit()

        # Convert the Pydantic input to SQLAlchemy models
        availability_data = [
            InstructorAvailability(
                instructor_id=instructor_id,
                day_of_week=slot.day_of_week,
                date=slot.date,
                start_time=datetime.strptime(slot.start_time, "%H:%M").time(),
                end_time=datetime.strptime(slot.end_time, "%H:%M").time()
            )
            for slot in availability
        ]
        
        # Add the new availability records
        db.add_all(availability_data)
        db.commit()

        # Return the updated availability as Pydantic models
        return [
            InstructorAvailabilityResponse(
                instructor_id=slot.instructor_id,
                day_of_week=slot.day_of_week,
                date=slot.date,
                start_time=slot.start_time,
                end_time=slot.end_time
            )
            for slot in availability_data
        ]

    except IntegrityError as e:
        print("Error:", e)
        db.rollback()  # Rollback in case of any error
        raise HTTPException(status_code=400, detail="Duplicate availability slot detected.")
    except Exception as e:
        print("Error:", e)
        db.rollback()  # Rollback in case of any error
        raise HTTPException(status_code=500, detail="Internal Server Error")
    

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
        local_resort=instructor.local_resort,
        profile_picture=instructor_user.profile_picture,
        hourly_rate=instructor.hourly_rate
    )
