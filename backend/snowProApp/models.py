# Models is a way for sqlalchemy to understand what kinds of database tables we are going to be creating within our database in the future

# This will be the record of what is actually inside the database table

from database import Base
from sqlalchemy import Column, Float, Integer, String, Date, DateTime, ForeignKey, Enum, Boolean, JSON, Time
from sqlalchemy.orm import relationship
import enum
from sqlalchemy import PrimaryKeyConstraint

class LessonStatusEnum(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"

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
    role = Column(String, nullable=False, default='student')  # Either "student", "instructor or admin"
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

class Lessons(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    instructor_id = Column(Integer, ForeignKey("instructors.id"))
    date = Column(DateTime, nullable=False)
    time = Column(String, nullable=False)
    ski_resort = Column(String, nullable=True)
    status = Column(String, default="pending")
    rejection_reason = Column(String, nullable=True)

    student = relationship("Students", back_populates="lessons")
    instructor = relationship("Instructors", back_populates="lessons")
    booked_slot = relationship("BookedSlot", back_populates="lesson", uselist=False) 

class Students(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)  # Link to Users table
    
    user = relationship("Users", back_populates="student")
    lessons = relationship("Lessons", back_populates="student", cascade="all, delete")

class Instructors(Base):
    __tablename__ = "instructors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)  # Link to Users table
    certificate_body = Column(Enum(CertificationBodyEnum), nullable=False)  
    level_of_qualification = Column(Enum(QualificationLevelEnum), nullable=False)  
    years_of_experience = Column(Integer, nullable=False)
    hourly_rate = Column(Float, nullable=True)
    local_resort = Column(String) 
    discipline = Column(String, nullable=False, default="ski") 
    specialties = Column(JSON, nullable=True, default=[])
    
    user = relationship("Users", back_populates="instructor")
    lessons = relationship("Lessons", back_populates="instructor", cascade="all, delete")

    # Relationship back to availability
    availabilities = relationship("InstructorAvailability", back_populates="instructor")
    # Relationship back to bookedSlot
    booked_slots = relationship("BookedSlot", back_populates="instructor")

class InstructorAvailability(Base):
    __tablename__ = "instructor_availabilities"

    instructor_id = Column(Integer, ForeignKey("instructors.id"))
    day_of_week = Column(String)
    start_time = Column(Time)
    date = Column(Date, nullable=False)
    end_time = Column(Time, nullable=False)

    instructor = relationship("Instructors", back_populates="availabilities")

    # Define composite primary key
    __table_args__ = (
        PrimaryKeyConstraint('instructor_id', 'day_of_week', 'start_time'),
    )


class BookedSlot(Base):
    __tablename__ = "booked_slots"

    id = Column(Integer, primary_key=True, index=True)
    instructor_id = Column(Integer, ForeignKey("instructors.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)

    instructor = relationship("Instructors", back_populates="booked_slots")
    lesson = relationship("Lessons", back_populates="booked_slot") 







    







