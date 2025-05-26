# Models is a way for sqlalchemy to understand what kinds of database tables we are going to be creating within our database in the future

# This will be the record of what is actually inside the database table

from database import Base
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship, validates
import enum

#Enum for certification bodies (CASI, CSIA, NZSIA, BASI)
class CertificationBodyEnum(str, enum.Enum):
    CASI = "CASI"
    CSIA = "CSIA"
    NZSIA = "NZSIA"
    BASI = "BASI"

#Enum for certification bodies levels (1 - 4)
class QualificationLevelEnum(int, enum.Enum):
    Level1 = 1
    Level2 = 2
    Level3 = 3
    Level4 = 4

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)  
    role = Column(String, nullable=False)  # Either "student", "instructor or admin"
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    contact = Column(String, nullable=False)  
    date_of_birth = Column(Date, nullable=False)
    address = Column(String, nullable=True)
    language=Column(String, nullable=False)
    is_active = Column(Boolean)
    profile_picture = Column(String, nullable=True) # Path or URL to profile image

    # One-to-one relationships
    student = relationship("Students", back_populates="user", uselist=False)
    instructor = relationship("Instructors", back_populates="user", uselist=False)



class Students(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)  # Link to Users table
    
    user = relationship("Users", back_populates="student")

class Instructors(Base):
    __tablename__ = "instructors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)  # Link to Users table
    certificate_body = Column(Enum(CertificationBodyEnum), nullable=False)  
    level_of_qualification = Column(Enum(QualificationLevelEnum), nullable=False)  
    years_of_experience = Column(Integer, nullable=False) 
    
    user = relationship("Users", back_populates="instructor")



    







