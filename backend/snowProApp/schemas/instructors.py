from typing import Annotated, Optional
from pydantic import BaseModel, constr, field_validator
from schemas.users import UserResponse 
from enum import Enum
from datetime import date


class CertificationBodyEnum(str, Enum):
    CASI = "CASI"
    CSIA = "CSIA"
    NZSIA = "NZSIA"
    BASI = "BASI"


class QualificationLevelEnum(int, Enum):
    Level1 = 1
    Level2 = 2
    Level3 = 3
    Level4 = 4


class InstructorResponse(UserResponse):    
    certificate_body: CertificationBodyEnum
    level_of_qualification: QualificationLevelEnum
    years_of_experience: int
    local_resort: Optional[str] = None
    profile_picture: Optional[str] = None
    class Config:
        from_attributes = True


class InstructorCreateUpdate(BaseModel):
    certificate_body: CertificationBodyEnum
    level_of_qualification: QualificationLevelEnum
    years_of_experience: int
    class Config:
        from_attributes = True

class InstructorUpdate(BaseModel):
    local_resort: Annotated[Optional[str], constr(max_length=100)] = None
                         
    @field_validator("local_resort")
    @classmethod
    def lowercase_resort(cls, value):
        return value.lower() if value else value