from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, date, time

from database import SessionLocal
from models import Lessons, Users, InstructorAvailability, BookedSlot
from schemas.lessons import LessonRequestCreate, LessonResponse
from .auth import get_current_user

router = APIRouter(prefix="/lessons", tags=["Lessons"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
def create_lesson_request(
    request_data: LessonRequestCreate,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    # Ensure student role
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can request lessons.")

    lesson = Lessons(
        student_id=current_user.id,
        instructor_id=request_data.instructor_id,
        date=request_data.date,
        ski_resort=request_data.ski_resort,
        status="pending"
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson


@router.get("/instructor", response_model=List[LessonResponse])
def get_lesson_requests_for_instructor(
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    if current_user.role != "instructor":
        raise HTTPException(status_code=403, detail="Only instructors can view lesson requests.")

    lessons = db.query(Lessons).filter(Lessons.instructor_id == current_user.id).all()
    return lessons


@router.patch("/{lesson_id}/accept", response_model=LessonResponse)
def accept_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    lesson = db.query(Lessons).filter(Lessons.id == lesson_id).first()

    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson request not found")
    if lesson.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to accept this request")

    lesson.status = "accepted"
    db.commit()
    db.refresh(lesson)
    return lesson


@router.patch("/{lesson_id}/reject", response_model=LessonResponse)
def reject_lesson(
    lesson_id: int,
    reason: str,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    lesson = db.query(Lessons).filter(Lessons.id == lesson_id).first()

    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson request not found")
    if lesson.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to reject this request")

    lesson.status = "rejected"
    lesson.rejection_reason = reason
    db.commit()
    db.refresh(lesson)
    return lesson

@router.post("/lesson/{lesson_id}/book")
async def book_slot(
    lesson_id: int, 
    instructor_id: int, 
    date: date, 
    start_time: time, 
    db: Session = Depends(get_db)
):
    # Check if the slot is available
    available_slot = db.query(InstructorAvailability).filter(
        InstructorAvailability.instructor_id == instructor_id,
        InstructorAvailability.day_of_week == date.strftime("%A"),
        InstructorAvailability.start_time == start_time
    ).first()

    if not available_slot:
        raise HTTPException(status_code=404, detail="Slot not available")

    # Mark slot as booked
    booked_slot = BookedSlot(
        instructor_id=instructor_id,
        lesson_id=lesson_id,
        date=date,
        start_time=start_time
    )
    db.add(booked_slot)
    db.commit()

    # Change lesson status to "accepted"
    lesson = db.query(Lessons).filter(Lessons.id == lesson_id).first()
    lesson.status = "accepted"
    db.commit()

    return {"message": "Lesson successfully booked!"}
