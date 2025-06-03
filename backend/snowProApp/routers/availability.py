from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, time
from database import SessionLocal
from models import Instructors, InstructorAvailability, Lessons
from typing import List

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/instructor/{instructor_id}/availability")
async def add_availability(
    instructor_id: int, 
    date: date, 
    start_time: time, 
    end_time: time, 
    db: Session = Depends(get_db)
):
    instructor = db.query(Instructors).filter(Instructors.id == instructor_id).first()
    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor not found")
    
    availability = InstructorAvailability(
        instructor_id=instructor_id, 
        date=date, 
        start_time=start_time, 
        end_time=end_time
    )
    
    db.add(availability)
    db.commit()
    db.refresh(availability)
    return availability

@router.get("/instructor/{instructor_id}/availability")
async def view_availability(
    instructor_id: int, 
    db: Session = Depends(get_db)
):
    availabilities = db.query(InstructorAvailability).filter(InstructorAvailability.instructor_id == instructor_id).all()
    return availabilities



