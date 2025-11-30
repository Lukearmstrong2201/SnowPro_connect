from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Literal

class AdminCreateUserRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    contact: str
    address: str
    language: str
    date_of_birth: date
    role: Literal["admin"] #only admins can create admins

    class Config:
        from_attributes = True
