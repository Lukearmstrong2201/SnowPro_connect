from fastapi import APIRouter, Depends, HTTPException
from models import Instructors, Users
from database import SessionLocal
from sqlalchemy.orm import Session

router = APIRouter(prefix="/instructors", tags=["Instructors"])  

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{instructor_id}", status_code=200)
async def get_instructor(instructor_id: int, db: Session = Depends(get_db)):
    instructor = db.query(Instructors).filter(Instructors.id == instructor_id).first()

    if not instructor:
        raise HTTPException(status_code=404, detail="Instructor not found")

    # ✅ Fetch the associated user for name details
    user = db.query(Users).filter(Users.id == instructor.user_id).first()

    return {
        "id": instructor.id,
        "user_id": instructor.user_id,
        "name": f"{user.first_name} {user.last_name}",
        "certificate_body": instructor.certificate_body,
        "level_of_qualification": instructor.level_of_qualification,
        "years_of_experience": instructor.years_of_experience,
        "languages": instructor.languages
    }