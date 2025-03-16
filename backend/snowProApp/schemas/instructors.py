from pydantic import BaseModel
from .users import UserBase  
from enum import Enum


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


class InstructorResponse(UserBase):
    certificate_body: CertificationBodyEnum
    level_of_qualification: QualificationLevelEnum
    years_of_experience: int
    languages: str

    class Config:
        orm_mode = True


class InstructorCreateUpdate(BaseModel):
    certificate_body: CertificationBodyEnum
    level_of_qualification: QualificationLevelEnum
    years_of_experience: int
    languages: str

    class Config:
        orm_mode = True