from pydantic import BaseModel
from datetime import date
from schemas.users import UserResponse

class StudentResponse(UserResponse):
    pass

    class Config:
        from_attributes = True