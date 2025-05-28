from fastapi import APIRouter, Depends, HTTPException, Query
from models import Instructors, Users, InstructorAvailability, BookedSlot
from database import SessionLocal
from sqlalchemy.orm import Session
from .auth import get_current_user
from typing import Annotated, List
from schemas.instructors import InstructorResponse, InstructorUpdate
from datetime import date
from pydantic import BaseModel

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

# Pydantic model for Availability Slot
class AvailabilitySlot(BaseModel):
    day_of_week: str  # e.g., 'Monday', 'Tuesday', etc.
    start_time: str  # Time format "HH:MM"
    end_time: str    # Time format "HH:MM"

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
        local_resort=instructor.local_resort,
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

# POST to set instructor availability
@router.post("/instructor/{instructor_id}/set-availability")
async def set_availability(
    instructor_id: int, 
    availability: List[AvailabilitySlot],  # List of available times for each day of the week
    db: Session = Depends(get_db)
):
    instructor = db.query(Instructors).filter(Instructors.id == instructor_id).first()
    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor not found")

    # Clear existing availability and set new
    db.query(InstructorAvailability).filter(InstructorAvailability.instructor_id == instructor_id).delete()
    db.commit()

    for slot in availability:
        day_of_week = slot.day_of_week
        start_time = slot.start_time
        end_time = slot.end_time
        availability_entry = InstructorAvailability(
            instructor_id=instructor_id,
            day_of_week=day_of_week,
            start_time=start_time,
            end_time=end_time
        )
        db.add(availability_entry)
    db.commit()

    return {"message": "Availability updated successfully."}

# GET available slots for a given instructor and date
@router.get("/instructor/{instructor_id}/availability")
async def get_available_slots(
    instructor_id: int, 
    date: date, 
    db: Session = Depends(get_db)
):
    # Get the day of the week for the selected date
    day_of_week = date.strftime("%A")
    
    # Fetch availability for this day
    available_slots = db.query(InstructorAvailability).filter(
        InstructorAvailability.instructor_id == instructor_id,
        InstructorAvailability.day_of_week == day_of_week
    ).all()

    # Filter out already booked slots
    booked_slots = db.query(BookedSlot).filter(
        BookedSlot.instructor_id == instructor_id,
        BookedSlot.date == date
    ).all()

    # Create a list of available time slots for the instructor on this date
    available_times = []
    for slot in available_slots:
        is_booked = any(booked_slot.start_time == slot.start_time for booked_slot in booked_slots)
        if not is_booked:
            available_times.append({
                "start_time": slot.start_time,
                "end_time": slot.end_time
            })
    
    return available_times
