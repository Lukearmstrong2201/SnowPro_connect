from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Literal

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    contact: str
    address: str
    language: str
    date_of_birth: date
    role: Literal["student", "instructor", "admin"]
    is_active: bool

    class Config:
        from_attributes = True

class UserRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    contact: str
    address: str
    language: str
    date_of_birth: date
    role: Literal["student", "instructor", "admin"]

    class Config:
        from_attributes = True