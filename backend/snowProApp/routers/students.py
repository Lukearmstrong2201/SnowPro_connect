from fastapi import APIRouter, Depends, HTTPException
from models import Students
from database import SessionLocal
from sqlalchemy.orm import Session

router = APIRouter(prefix="/students", tags=["Students"])  # ✅ Define the router

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{student_id}", status_code=200)
async def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Students).filter(Students.user_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student
