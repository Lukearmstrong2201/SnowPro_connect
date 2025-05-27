from pydantic import BaseModel
from datetime import datetime

class LessonRequestCreate(BaseModel):
    instructor_id: int
    date: datetime
    ski_resort: str 

class LessonResponse(BaseModel):
    id: int
    student_id: int
    instructor_id: int
    date: datetime
    ski_resort: str
    status: str
    rejection_reason: str | None = None

    class Config:
        from_attributes = True
