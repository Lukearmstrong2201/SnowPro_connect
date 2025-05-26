from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Literal, Optional

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
    profile_picture: Optional[str] = None
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

from typing import Optional
from pydantic import BaseModel

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    contact: Optional[str] = None
    address: Optional[str] = None
    language: Optional[str] = None

    class Config:
        from_attributes = True


