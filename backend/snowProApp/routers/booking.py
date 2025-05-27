from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Lessons, Instructors, Students, Users, LessonStatusEnum
from schemas.booking import LessonCreate, LessonResponse, LessonUpdateStatus
from typing import Annotated, List
from .auth import get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[Users, Depends(get_current_user)]

# POST Student creates lesson request
@router.post("/", response_model=LessonResponse, status_code=201)
async def create_lesson(
    lesson: LessonCreate,
    db: db_dependency,
    current_user: user_dependency,
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can request lessons.")

    student = db.query(Students).filter(Students.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    instructor = db.query(Instructors).filter(Instructors.id == lesson.instructor_id).first()
    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor not found.")

    new_lesson = Lessons(
        student_id=student.id,
        instructor_id=lesson.instructor_id,
        date=lesson.date,
        time=lesson.time,
        ski_resort=lesson.ski_resort,
        status=LessonStatusEnum.pending,
    )
    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)

    return new_lesson

# GET Instructor sees their lesson requests
@router.get("/instructor", response_model=List[LessonResponse])
async def get_instructor_lessons(
    db: db_dependency,
    current_user: user_dependency
):
    if current_user.role != "instructor":
        raise HTTPException(status_code=403, detail="Only instructors can view this.")

    instructor = db.query(Instructors).filter(Instructors.user_id == current_user.id).first()
    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor profile not found.")

    lessons = db.query(Lessons).filter(Lessons.instructor_id == instructor.id).all()
    return lessons

# GET Student sees their lesson requests
@router.get("/student", response_model=List[LessonResponse])
async def get_student_lessons(
    db: db_dependency,
    current_user: user_dependency
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can view this.")

    student = db.query(Students).filter(Students.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    lessons = db.query(Lessons).filter(Lessons.student_id == student.id).all()
    return lessons


# PATCH Instructor to accept a lesson
@router.patch("/accept/{lesson_id}", response_model=LessonResponse)
async def accept_lesson_request(
    db: db_dependency,
    current_user: user_dependency,
    lesson_id: int = Path(..., gt=0),
):
    if current_user.role != "instructor":
        raise HTTPException(status_code=403, detail="Only instructors can accept lessons.")

    instructor = db.query(Instructors).filter(Instructors.user_id == current_user.id).first()
    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor profile not found.")

    lesson = db.query(Lessons).filter(Lessons.id == lesson_id, Lessons.instructor_id == instructor.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found.")

    lesson.status = LessonStatusEnum.accepted
    db.commit()
    db.refresh(lesson)
    return lesson

# PATCH Instructor to reject a lesson
@router.patch("/reject/{lesson_id}", response_model=LessonResponse)
async def reject_lesson_request(
    db: db_dependency,
    current_user: user_dependency,
    update: LessonUpdateStatus,
    lesson_id: int = Path(..., gt=0),
):

    if current_user.role != "instructor":
        raise HTTPException(status_code=403, detail="Only instructors can reject lessons.")

    instructor = db.query(Instructors).filter(Instructors.user_id == current_user.id).first()
    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor profile not found.")

    lesson = db.query(Lessons).filter(Lessons.id == lesson_id, Lessons.instructor_id == instructor.id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found.")

    lesson.status = LessonStatusEnum.rejected
    lesson.rejection_reason = update.rejection_reason
    db.commit()
    db.refresh(lesson)
    return lesson

