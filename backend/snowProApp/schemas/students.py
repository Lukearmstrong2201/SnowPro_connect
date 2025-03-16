from pydantic import BaseModel
from datetime import date

class StudentResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    contact: str
    address: str
    language: str  # This comes from the Users model
    date_of_birth: date
    role: str
    is_active: bool

    class Config:
        orm_mode = True