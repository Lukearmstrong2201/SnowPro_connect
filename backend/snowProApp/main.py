# Main file is the root folder where i create the fastApi application

from fastapi import FastAPI
import models
from database import engine
from routers import auth, users, students, instructors, admin

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(students.router)
app.include_router(instructors.router)
app.include_router(admin.router)



    
