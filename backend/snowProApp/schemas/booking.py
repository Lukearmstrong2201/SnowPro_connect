from pydantic import BaseModel
from datetime import date, time
from enum import Enum

class LessonStatusEnum(str, Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"

class LessonBase(BaseModel):
    date: date
    time: time
    ski_resort: str

class LessonCreate(LessonBase):
    instructor_id: int

class LessonResponse(LessonBase):
    id: int
    student_id: int
    instructor_id: int
    status: LessonStatusEnum
    rejection_reason: str | None = None

    class Config:
        from_attributes = True

class LessonUpdateStatus(BaseModel):
    rejection_reason: str

