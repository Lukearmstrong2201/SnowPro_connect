from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import SessionLocal
from models import LessonRequests, Users
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

    lesson = LessonRequests(
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

    lessons = db.query(LessonRequests).filter(LessonRequests.instructor_id == current_user.id).all()
    return lessons


@router.patch("/{lesson_id}/accept", response_model=LessonResponse)
def accept_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: Users = Depends(get_current_user)
):
    lesson = db.query(LessonRequests).filter(LessonRequests.id == lesson_id).first()

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
    lesson = db.query(LessonRequests).filter(LessonRequests.id == lesson_id).first()

    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson request not found")
    if lesson.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to reject this request")

    lesson.status = "rejected"
    lesson.rejection_reason = reason
    db.commit()
    db.refresh(lesson)
    return lesson