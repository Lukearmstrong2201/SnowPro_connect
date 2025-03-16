from pydantic import BaseModel
from datetime import date
from typing import Optional


class UserBase(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    contact: str
    address: Optional[str] = None
    language: str
    date_of_birth: date
    role: str
    is_active: bool

    class Config:
        orm_mode = True