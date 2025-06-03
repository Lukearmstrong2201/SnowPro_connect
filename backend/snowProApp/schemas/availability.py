from pydantic import BaseModel
from datetime import date, time
from typing import List

# This model represents the input data for availability
class AvailabilitySlot(BaseModel):
    day_of_week: str  
    date: date        
    start_time: str   
    end_time: str     

    class Config:
        orm_mode = True  

# This model represents the request structure containing the instructor ID and the availability slots
class AvailabilityRequest(BaseModel):
    instructor_id: int               
    availability: List[AvailabilitySlot]  

    class Config:
        orm_mode = True 

# This model represents the response structure for a single instructor's availability slot
class InstructorAvailabilityResponse(BaseModel):
    instructor_id: int
    day_of_week: str
    date: date
    start_time: time
    end_time: time

    class Config:
        orm_mode = True  
